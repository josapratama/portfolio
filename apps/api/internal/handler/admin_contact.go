package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// ── Contact Settings ──────────────────────────────────────────────────────────

func (h *AdminHandler) GetContactSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT section_title, section_subtitle, recipient_email, success_message, error_message,
		        enable_contact_form, show_social_links
		 FROM contact_settings WHERE id = 1`)
	var title, subtitle, successMsg, errMsg []byte
	var recipientEmail string
	var enableForm, showSocial bool
	if err := row.Scan(&title, &subtitle, &recipientEmail, &successMsg, &errMsg, &enableForm, &showSocial); err != nil {
		response.InternalServerError(w)
		return
	}
	response.Success(w, map[string]interface{}{
		"section_title": json.RawMessage(title), "section_subtitle": json.RawMessage(subtitle),
		"recipient_email":     recipientEmail,
		"success_message":     json.RawMessage(successMsg),
		"error_message":       json.RawMessage(errMsg),
		"enable_contact_form": enableForm, "show_social_links": showSocial,
	})
}

func (h *AdminHandler) UpdateContactSettings(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}

	titleVal := req["section_title"]
	if titleVal == nil {
		titleVal = req["heading"]
	}
	subVal := req["section_subtitle"]
	if subVal == nil {
		subVal = req["subheading"]
	}
	recipVal := req["recipient_email"]
	if recipVal == nil {
		recipVal = req["email"]
	}
	enableFormVal := req["enable_contact_form"]
	if enableFormVal == nil {
		enableFormVal = req["form_enabled"]
	}
	showSocialVal := req["show_social_links"]
	if showSocialVal == nil {
		showSocialVal = true
	}

	titleJSON, _ := json.Marshal(titleVal)
	subJSON, _ := json.Marshal(subVal)
	successJSON, _ := json.Marshal(req["success_message"])
	errJSON, _ := json.Marshal(req["error_message"])

	h.db.Exec(r.Context(),
		`UPDATE contact_settings SET section_title=$1, section_subtitle=$2, recipient_email=$3,
		        success_message=$4, error_message=$5, enable_contact_form=$6, show_social_links=$7,
		        updated_at=NOW()
		 WHERE id=1`,
		titleJSON, subJSON, recipVal, successJSON, errJSON,
		enableFormVal, showSocialVal)
	response.Message(w, "contact settings updated")
}

// ── Contact Submissions ───────────────────────────────────────────────────────

func (h *AdminHandler) ListSubmissions(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	limit := 20
	offset := (page - 1) * limit

	rows, err := h.db.Query(r.Context(),
		`SELECT id, name, email, subject, message, is_read, is_archived,
		        COALESCE(TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '')
		 FROM contact_submissions WHERE is_archived = false
		 ORDER BY created_at DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Sub struct {
		ID         string `json:"id"`
		Name       string `json:"name"`
		Email      string `json:"email"`
		Subject    string `json:"subject"`
		Message    string `json:"message"`
		IsRead     bool   `json:"is_read"`
		IsArchived bool   `json:"is_archived"`
		CreatedAt  string `json:"created_at"`
	}
	subs := []Sub{}
	for rows.Next() {
		var s Sub
		if err := rows.Scan(&s.ID, &s.Name, &s.Email, &s.Subject, &s.Message, &s.IsRead, &s.IsArchived, &s.CreatedAt); err != nil {
			continue
		}
		subs = append(subs, s)
	}
	response.Success(w, subs)
}

func (h *AdminHandler) MarkSubmissionRead(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `UPDATE contact_submissions SET is_read=true WHERE id=$1`, id)
	response.Message(w, "marked as read")
}

func (h *AdminHandler) ArchiveSubmission(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `UPDATE contact_submissions SET is_archived=true WHERE id=$1`, id)
	response.Message(w, "archived")
}

func (h *AdminHandler) DeleteSubmission(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM contact_submissions WHERE id=$1`, id)
	response.NoContent(w)
}
