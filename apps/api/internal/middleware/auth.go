package middleware

import (
	"context"
	"net/http"
	"strings"

	jwtpkg "github.com/alexdev/portfolio/pkg/jwt"
	"github.com/alexdev/portfolio/pkg/response"
)

type contextKey string

const AdminIDKey contextKey = "admin_id"
const AdminEmailKey contextKey = "admin_email"

// AuthRequired validates the JWT access token from Authorization header
func AuthRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			response.Unauthorized(w)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := jwtpkg.ValidateAccessToken(tokenStr)
		if err != nil {
			response.Unauthorized(w)
			return
		}

		ctx := context.WithValue(r.Context(), AdminIDKey, claims.AdminID)
		ctx = context.WithValue(ctx, AdminEmailKey, claims.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetAdminID extracts admin ID from context
func GetAdminID(r *http.Request) string {
	if v, ok := r.Context().Value(AdminIDKey).(string); ok {
		return v
	}
	return ""
}
