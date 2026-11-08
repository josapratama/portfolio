package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// ── Skills ────────────────────────────────────────────────────────────────────

func (h *AdminHandler) ListSkills(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT s.id, s.category_id, s.name, s.icon, s.proficiency_level,
		        s.is_featured, s.is_visible, s.sort_order, sc.name AS category_name
		 FROM skills s LEFT JOIN skill_categories sc ON sc.id = s.category_id
		 ORDER BY s.sort_order`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Skill struct {
		ID               string          `json:"id"`
		CategoryID       *string         `json:"category_id"`
		Name             json.RawMessage `json:"name"`
		Icon             string          `json:"icon"`
		ProficiencyLevel string          `json:"proficiency_level"`
		IsFeatured       bool            `json:"is_featured"`
		IsVisible        bool            `json:"is_visible"`
		SortOrder        int             `json:"sort_order"`
		CategoryName     json.RawMessage `json:"category_name"`
	}
	skills := []Skill{}
	for rows.Next() {
		var s Skill
		var name, catName []byte
		rows.Scan(&s.ID, &s.CategoryID, &name, &s.Icon, &s.ProficiencyLevel, &s.IsFeatured, &s.IsVisible, &s.SortOrder, &catName)
		s.Name = json.RawMessage(name)
		if catName != nil {
			s.CategoryName = json.RawMessage(catName)
		}
		skills = append(skills, s)
	}
	response.Success(w, skills)
}

func (h *AdminHandler) CreateSkill(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	nameJSON, _ := json.Marshal(req["name"])
	isVisible := true
	if v, ok := req["is_visible"]; ok {
		if b, ok := v.(bool); ok {
			isVisible = b
		}
	}
	isFeatured := false
	if v, ok := req["is_featured"]; ok {
		if b, ok := v.(bool); ok {
			isFeatured = b
		}
	}
	h.db.Exec(r.Context(),
		`INSERT INTO skills (category_id, name, icon, proficiency_level, is_featured, is_visible, sort_order)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		req["category_id"], nameJSON, req["icon"], req["proficiency_level"], isFeatured, isVisible, req["sort_order"])
	response.Created(w, map[string]string{"message": "skill created"})
}

func (h *AdminHandler) UpdateSkill(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	// Partial update: only touch fields present in the request
	if _, hasName := req["name"]; hasName {
		nameJSON, _ := json.Marshal(req["name"])
		h.db.Exec(r.Context(), `UPDATE skills SET name=$1, updated_at=NOW() WHERE id=$2`, nameJSON, id)
	}
	if v, ok := req["category_id"]; ok && v != nil {
		h.db.Exec(r.Context(), `UPDATE skills SET category_id=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	if v, ok := req["proficiency_level"]; ok && v != nil {
		h.db.Exec(r.Context(), `UPDATE skills SET proficiency_level=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	if v, ok := req["is_featured"]; ok {
		h.db.Exec(r.Context(), `UPDATE skills SET is_featured=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	if v, ok := req["is_visible"]; ok {
		h.db.Exec(r.Context(), `UPDATE skills SET is_visible=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	if v, ok := req["sort_order"]; ok && v != nil {
		h.db.Exec(r.Context(), `UPDATE skills SET sort_order=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	if v, ok := req["icon"]; ok && v != nil {
		h.db.Exec(r.Context(), `UPDATE skills SET icon=$1, updated_at=NOW() WHERE id=$2`, v, id)
	}
	response.Message(w, "skill updated")
}

func (h *AdminHandler) DeleteSkill(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM skills WHERE id=$1`, id)
	response.NoContent(w)
}

// ── Skill Categories ──────────────────────────────────────────────────────────

func (h *AdminHandler) ListSkillCategories(w http.ResponseWriter, r *http.Request) {
	type SkillOut struct {
		ID               string          `json:"id"`
		CategoryID       *string         `json:"category_id"`
		Name             json.RawMessage `json:"name"`
		ProficiencyLevel string          `json:"proficiency_level"`
		IsFeatured       bool            `json:"is_featured"`
		IsVisible        bool            `json:"is_visible"`
		SortOrder        int             `json:"sort_order"`
	}
	type CatOut struct {
		ID        string          `json:"id"`
		Name      json.RawMessage `json:"name"`
		SortOrder int             `json:"sort_order"`
		Skills    []SkillOut      `json:"skills"`
	}

	rows, err := h.db.Query(r.Context(), `
		SELECT sc.id, sc.name, sc.sort_order,
		       s.id, s.name, s.proficiency_level, s.is_featured, s.is_visible, s.sort_order, s.category_id
		FROM skill_categories sc
		LEFT JOIN skills s ON s.category_id = sc.id
		ORDER BY sc.sort_order, s.sort_order`)
	if err != nil {
		response.Success(w, []CatOut{})
		return
	}
	defer rows.Close()

	catMap := map[string]int{}
	var cats []CatOut

	for rows.Next() {
		var catID string
		var catName []byte
		var catOrder int
		var skillID *string
		var skillName []byte
		var profLevel *string
		var isFeatured, isVisible *bool
		var skillOrder *int
		var skillCatID *string

		rows.Scan(&catID, &catName, &catOrder,
			&skillID, &skillName, &profLevel, &isFeatured, &isVisible, &skillOrder, &skillCatID)

		if _, exists := catMap[catID]; !exists {
			cats = append(cats, CatOut{
				ID: catID, Name: json.RawMessage(catName), SortOrder: catOrder, Skills: []SkillOut{},
			})
			catMap[catID] = len(cats) - 1
		}

		if skillID != nil {
			idx := catMap[catID]
			s := SkillOut{ID: *skillID, CategoryID: skillCatID, Name: json.RawMessage(skillName)}
			if profLevel != nil {
				s.ProficiencyLevel = *profLevel
			}
			if isFeatured != nil {
				s.IsFeatured = *isFeatured
			}
			if isVisible != nil {
				s.IsVisible = *isVisible
			}
			if skillOrder != nil {
				s.SortOrder = *skillOrder
			}
			cats[idx].Skills = append(cats[idx].Skills, s)
		}
	}

	if cats == nil {
		cats = []CatOut{}
	}
	response.Success(w, cats)
}

func (h *AdminHandler) CreateSkillCategory(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	nameJSON, _ := json.Marshal(req["name"])
	h.db.Exec(r.Context(),
		`INSERT INTO skill_categories (name, sort_order) VALUES ($1, $2)`, nameJSON, req["sort_order"])
	response.Created(w, map[string]string{"message": "category created"})
}

func (h *AdminHandler) DeleteSkillCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM skill_categories WHERE id=$1`, id)
	response.NoContent(w)
}
