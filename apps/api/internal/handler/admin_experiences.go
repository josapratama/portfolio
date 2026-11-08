package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

func (h *AdminHandler) ListExperiences(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, organization, role, location, employment_type,
		        TO_CHAR(start_date, 'YYYY-MM-DD'), TO_CHAR(end_date, 'YYYY-MM-DD'),
		        is_current, description, achievements, is_visible, sort_order
		 FROM experiences ORDER BY sort_order, start_date DESC`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Exp struct {
		ID             string          `json:"id"`
		Organization   json.RawMessage `json:"organization"`
		Role           json.RawMessage `json:"role"`
		Location       json.RawMessage `json:"location"`
		EmploymentType string          `json:"employment_type"`
		StartDate      string          `json:"start_date"`
		EndDate        *string         `json:"end_date"`
		IsCurrent      bool            `json:"is_current"`
		Description    json.RawMessage `json:"description"`
		Achievements   json.RawMessage `json:"achievements"`
		IsVisible      bool            `json:"is_visible"`
		SortOrder      int             `json:"sort_order"`
	}
	exps := []Exp{}
	for rows.Next() {
		var e Exp
		var org, role, loc, desc, ach []byte
		rows.Scan(&e.ID, &org, &role, &loc, &e.EmploymentType, &e.StartDate, &e.EndDate, &e.IsCurrent, &desc, &ach, &e.IsVisible, &e.SortOrder)
		e.Organization = json.RawMessage(org)
		e.Role = json.RawMessage(role)
		e.Location = json.RawMessage(loc)
		e.Description = json.RawMessage(desc)
		e.Achievements = json.RawMessage(ach)
		exps = append(exps, e)
	}
	response.Success(w, exps)
}

func (h *AdminHandler) CreateExperience(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	orgJSON, _ := json.Marshal(req["organization"])
	roleJSON, _ := json.Marshal(req["role"])
	locJSON, _ := json.Marshal(req["location"])
	descJSON, _ := json.Marshal(req["description"])
	achJSON, _ := json.Marshal(req["achievements"])

	isVisible := true
	if v, ok := req["is_visible"]; ok {
		if b, ok := v.(bool); ok {
			isVisible = b
		}
	}

	endDate := req["end_date"]
	if s, ok := endDate.(string); ok && s == "" {
		endDate = nil
	}

	var newID string
	err := h.db.QueryRow(r.Context(),
		`INSERT INTO experiences (organization, role, location, employment_type, start_date, end_date, is_current, description, achievements, is_visible, sort_order)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
		orgJSON, roleJSON, locJSON, req["employment_type"], req["start_date"], endDate,
		req["is_current"], descJSON, achJSON, isVisible, req["sort_order"]).Scan(&newID)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	response.Created(w, map[string]string{"id": newID})
}

func (h *AdminHandler) UpdateExperience(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	orgJSON, _ := json.Marshal(req["organization"])
	roleJSON, _ := json.Marshal(req["role"])
	locJSON, _ := json.Marshal(req["location"])
	descJSON, _ := json.Marshal(req["description"])
	achJSON, _ := json.Marshal(req["achievements"])

	endDate := req["end_date"]
	if s, ok := endDate.(string); ok && s == "" {
		endDate = nil
	}

	h.db.Exec(r.Context(),
		`UPDATE experiences SET organization=$1, role=$2, location=$3, employment_type=$4,
		        start_date=$5, end_date=$6, is_current=$7, description=$8, achievements=$9,
		        is_visible=$10, sort_order=$11, updated_at=NOW()
		 WHERE id=$12`,
		orgJSON, roleJSON, locJSON, req["employment_type"], req["start_date"], endDate,
		req["is_current"], descJSON, achJSON, req["is_visible"], req["sort_order"], id)
	response.Message(w, "experience updated")
}

func (h *AdminHandler) DeleteExperience(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM experiences WHERE id=$1`, id)
	response.NoContent(w)
}
