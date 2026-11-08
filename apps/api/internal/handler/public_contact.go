package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/alexdev/portfolio/pkg/response"
)

// GetSocialLinks returns all visible social links.
func (h *PublicHandler) GetSocialLinks(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, platform, url, label, open_in_new_tab FROM social_links WHERE is_visible = true ORDER BY sort_order`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Link struct {
		ID           string `json:"id"`
		Platform     string `json:"platform"`
		URL          string `json:"url"`
		Label        string `json:"label"`
		OpenInNewTab bool   `json:"open_in_new_tab"`
	}
	links := []Link{}
	for rows.Next() {
		var l Link
		rows.Scan(&l.ID, &l.Platform, &l.URL, &l.Label, &l.OpenInNewTab)
		links = append(links, l)
	}
	response.Success(w, links)
}

// GetContactSettings returns contact section settings.
func (h *PublicHandler) GetContactSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT section_title, section_subtitle, success_message, error_message, enable_contact_form, show_social_links
		 FROM contact_settings WHERE id = 1`)
	var title, subtitle, successMsg, errMsg []byte
	var enableForm, showSocial bool
	if err := row.Scan(&title, &subtitle, &successMsg, &errMsg, &enableForm, &showSocial); err != nil {
		response.InternalServerError(w)
		return
	}
	response.Success(w, map[string]interface{}{
		"section_title": json.RawMessage(title), "section_subtitle": json.RawMessage(subtitle),
		"success_message": json.RawMessage(successMsg), "error_message": json.RawMessage(errMsg),
		"enable_contact_form": enableForm, "show_social_links": showSocial,
	})
}

// SubmitContact handles contact form submissions.
func (h *PublicHandler) SubmitContact(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Name == "" || req.Email == "" || req.Message == "" {
		response.BadRequest(w, "name, email, and message are required")
		return
	}

	var enabled bool
	h.db.QueryRow(r.Context(), `SELECT enable_contact_form FROM contact_settings WHERE id = 1`).Scan(&enabled)
	if !enabled {
		response.BadRequest(w, "contact form is currently disabled")
		return
	}

	ip := r.RemoteAddr
	_, err := h.db.Exec(r.Context(),
		`INSERT INTO contact_submissions (name, email, subject, message, ip_address) VALUES ($1, $2, $3, $4, $5)`,
		req.Name, req.Email, req.Subject, req.Message, ip)
	if err != nil {
		response.InternalServerError(w)
		return
	}

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		var recipientEmail string
		_ = h.db.QueryRow(ctx, `SELECT recipient_email FROM contact_settings WHERE id = 1`).Scan(&recipientEmail)
		if recipientEmail != "" && h.mailer != nil {
			_ = h.mailer.SendContactNotification(recipientEmail, req.Name, req.Email, req.Subject, req.Message)
		}
	}()

	response.Message(w, "message sent successfully")
}
