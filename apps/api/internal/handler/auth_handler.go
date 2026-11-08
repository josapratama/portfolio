package handler

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"

	"github.com/alexdev/portfolio/config"
	"github.com/alexdev/portfolio/internal/middleware"
	jwtpkg "github.com/alexdev/portfolio/pkg/jwt"
	"github.com/alexdev/portfolio/pkg/response"
)

func isSecureRequest(r *http.Request) bool {
	if config.Cfg != nil && config.Cfg.AppEnv == "production" {
		return true
	}
	if r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https" {
		return true
	}
	return false
}

func getCookieSameSite(secure bool) http.SameSite {
	if secure {
		return http.SameSiteNoneMode
	}
	return http.SameSiteLaxMode
}

type AuthHandler struct {
	db *pgxpool.Pool
}

func NewAuthHandler(db *pgxpool.Pool) *AuthHandler {
	return &AuthHandler{db: db}
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	AccessToken string `json:"access_token"`
	Admin       struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"admin"`
}

// Login handles admin authentication
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Email == "" || req.Password == "" {
		response.BadRequest(w, "email and password are required")
		return
	}

	var id, email, passwordHash, name string
	err := h.db.QueryRow(r.Context(),
		`SELECT id, email, password_hash, name FROM admins WHERE email = $1`, req.Email).
		Scan(&id, &email, &passwordHash, &name)
	if err != nil {
		response.Unauthorized(w)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		response.Unauthorized(w)
		return
	}

	accessToken, err := jwtpkg.GenerateAccessToken(id, email)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	// Generate and store refresh token
	refreshToken, err := jwtpkg.GenerateRefreshToken()
	if err != nil {
		response.InternalServerError(w)
		return
	}

	hash := sha256.Sum256([]byte(refreshToken))
	tokenHash := hex.EncodeToString(hash[:])
	expiresAt := time.Now().Add(30 * 24 * time.Hour)

	_, err = h.db.Exec(r.Context(),
		`INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
		id, tokenHash, expiresAt)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	// Set refresh token as httpOnly cookie
	secure := isSecureRequest(r)
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   secure,
		SameSite: getCookieSameSite(secure),
		Path:     "/api/v1/auth",
		Expires:  expiresAt,
	})

	resp := authResponse{AccessToken: accessToken}
	resp.Admin.ID = id
	resp.Admin.Email = email
	resp.Admin.Name = name
	response.Success(w, resp)
}

// Refresh issues new access token from valid refresh token cookie
func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Unauthorized(w)
		return
	}

	hash := sha256.Sum256([]byte(cookie.Value))
	tokenHash := hex.EncodeToString(hash[:])

	var adminID, email, name string
	var expiresAt time.Time
	err = h.db.QueryRow(r.Context(),
		`SELECT rt.admin_id, a.email, a.name, rt.expires_at 
		 FROM refresh_tokens rt JOIN admins a ON a.id = rt.admin_id
		 WHERE rt.token_hash = $1`, tokenHash).
		Scan(&adminID, &email, &name, &expiresAt)
	if err != nil || time.Now().After(expiresAt) {
		response.Unauthorized(w)
		return
	}

	accessToken, err := jwtpkg.GenerateAccessToken(adminID, email)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	resp := authResponse{AccessToken: accessToken}
	resp.Admin.ID = adminID
	resp.Admin.Email = email
	resp.Admin.Name = name
	response.Success(w, resp)
}

// Logout clears the refresh token
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		hash := sha256.Sum256([]byte(cookie.Value))
		tokenHash := hex.EncodeToString(hash[:])
		h.db.Exec(context.Background(),
			`DELETE FROM refresh_tokens WHERE token_hash = $1`, tokenHash)
	}

	secure := isSecureRequest(r)
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		HttpOnly: true,
		Secure:   secure,
		SameSite: getCookieSameSite(secure),
		Path:     "/api/v1/auth",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})

	response.Message(w, "logged out successfully")
}

// Me returns current admin info
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	adminID := middleware.GetAdminID(r)
	var id, email, name string
	err := h.db.QueryRow(r.Context(),
		`SELECT id, email, name FROM admins WHERE id = $1`, adminID).
		Scan(&id, &email, &name)
	if err != nil {
		response.NotFound(w, "admin not found")
		return
	}
	response.Success(w, map[string]string{"id": id, "email": email, "name": name})
}

type authHubCallbackRequest struct {
	Code        string `json:"code"`
	RedirectURI string `json:"redirect_uri"`
}

type authHubTokenResponse struct {
	AccessToken string `json:"accessToken"`
	User        struct {
		ID         string `json:"id"`
		Email      string `json:"email"`
		Username   string `json:"username"`
		Name       string `json:"name"`
		AppRole    string `json:"appRole"`
		GlobalRole string `json:"globalRole"`
	} `json:"user"`
	Error string `json:"error"`
}

// AuthHubConfig returns SSO client configuration for frontend
func (h *AuthHandler) AuthHubConfig(w http.ResponseWriter, r *http.Request) {
	response.Success(w, map[string]string{
		"authhub_url": config.Cfg.AuthHubURL,
		"client_id":   config.Cfg.AuthHubClientID,
		"client_slug": "portfolio",
	})
}

// AuthHubCallback exchanges OAuth code with AuthHub and logs in the primary administrator
func (h *AuthHandler) AuthHubCallback(w http.ResponseWriter, r *http.Request) {
	var req authHubCallbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Code == "" {
		response.BadRequest(w, "parameter 'code' otorisasi wajib disertakan")
		return
	}

	// 1. Exchange OAuth code with AuthHub SSO server
	ahEndpoint := fmt.Sprintf("%s/api/v1/auth/token", config.Cfg.AuthHubURL)
	payload, _ := json.Marshal(map[string]string{
		"code":         req.Code,
		"clientId":     config.Cfg.AuthHubClientID,
		"clientSecret": config.Cfg.AuthHubClientSecret,
		"grantType":    "authorization_code",
		"redirectUri":  req.RedirectURI,
	})

	client := &http.Client{Timeout: 10 * time.Second}
	ahRes, err := client.Post(ahEndpoint, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		response.Error(w, http.StatusBadGateway, fmt.Sprintf("Gagal menghubungi AuthHub SSO: %v", err))
		return
	}
	defer ahRes.Body.Close()

	var ahResp authHubTokenResponse
	if err := json.NewDecoder(ahRes.Body).Decode(&ahResp); err != nil {
		response.Error(w, http.StatusBadGateway, "Gagal memproses respon dari AuthHub")
		return
	}

	if ahRes.StatusCode != http.StatusOK {
		errMsg := ahResp.Error
		if errMsg == "" {
			errMsg = "Otorisasi AuthHub ditolak"
		}
		response.Error(w, http.StatusUnauthorized, errMsg)
		return
	}

	// 2. Strict Role Verification: Only AuthHub primary root account or superadmin/admin is authorized
	isSuper := ahResp.User.GlobalRole == "superadmin" || ahResp.User.AppRole == "superadmin"
	isAdmin := ahResp.User.AppRole == "admin"
	isRootUser := ahResp.User.Username == "josapratama" || strings.HasPrefix(ahResp.User.Email, "josapratama@")

	if !isSuper && !isRootUser && !isAdmin {
		response.Error(w, http.StatusForbidden, "Akses ditolak: Akun Anda tidak memiliki hak akses administrator untuk Portfolio.")
		return
	}

	// 3. Upsert admin in local portfolio database
	var adminID, adminEmail, adminName string
	err = h.db.QueryRow(r.Context(),
		`SELECT id, email, name FROM admins WHERE email = $1`, ahResp.User.Email).
		Scan(&adminID, &adminEmail, &adminName)

	if err != nil {
		// New admin created from AuthHub identity
		nameToUse := ahResp.User.Name
		if nameToUse == "" {
			nameToUse = ahResp.User.Username
		}
		if nameToUse == "" {
			nameToUse = "Admin Josa"
		}

		err = h.db.QueryRow(r.Context(),
			`INSERT INTO admins (email, password_hash, name) VALUES ($1, 'AUTHHUB_OAUTH_ACCOUNT', $2) RETURNING id, email, name`,
			ahResp.User.Email, nameToUse).
			Scan(&adminID, &adminEmail, &adminName)
		if err != nil {
			response.InternalServerError(w)
			return
		}
	}

	// 4. Issue standard Portfolio JWT tokens
	accessToken, err := jwtpkg.GenerateAccessToken(adminID, adminEmail)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	refreshToken, err := jwtpkg.GenerateRefreshToken()
	if err != nil {
		response.InternalServerError(w)
		return
	}

	hash := sha256.Sum256([]byte(refreshToken))
	tokenHash := hex.EncodeToString(hash[:])
	expiresAt := time.Now().Add(30 * 24 * time.Hour)

	_, err = h.db.Exec(r.Context(),
		`INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
		adminID, tokenHash, expiresAt)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	secure := isSecureRequest(r)
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   secure,
		SameSite: getCookieSameSite(secure),
		Path:     "/api/v1/auth",
		Expires:  expiresAt,
	})

	resp := authResponse{AccessToken: accessToken}
	resp.Admin.ID = adminID
	resp.Admin.Email = adminEmail
	resp.Admin.Name = adminName
	response.Success(w, resp)
}
