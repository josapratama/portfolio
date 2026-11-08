package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// ── Social Links ──────────────────────────────────────────────────────────────

func (h *AdminHandler) ListSocialLinks(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, platform, url, label, is_visible, open_in_new_tab, sort_order
		 FROM social_links ORDER BY sort_order`)
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
		IsVisible    bool   `json:"is_visible"`
		OpenInNewTab bool   `json:"open_in_new_tab"`
		SortOrder    int    `json:"sort_order"`
	}
	links := []Link{}
	for rows.Next() {
		var l Link
		rows.Scan(&l.ID, &l.Platform, &l.URL, &l.Label, &l.IsVisible, &l.OpenInNewTab, &l.SortOrder)
		links = append(links, l)
	}
	response.Success(w, links)
}

func (h *AdminHandler) CreateSocialLink(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Platform     string `json:"platform"`
		URL          string `json:"url"`
		Label        string `json:"label"`
		IsVisible    *bool  `json:"is_visible"`
		OpenInNewTab bool   `json:"open_in_new_tab"`
		SortOrder    int    `json:"sort_order"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	isVisible := true
	if req.IsVisible != nil {
		isVisible = *req.IsVisible
	}
	h.db.Exec(r.Context(),
		`INSERT INTO social_links (platform, url, label, is_visible, open_in_new_tab, sort_order)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		req.Platform, req.URL, req.Label, isVisible, req.OpenInNewTab, req.SortOrder)
	response.Created(w, map[string]string{"message": "social link created"})
}

func (h *AdminHandler) UpdateSocialLink(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req struct {
		Platform     string `json:"platform"`
		URL          string `json:"url"`
		Label        string `json:"label"`
		IsVisible    bool   `json:"is_visible"`
		OpenInNewTab bool   `json:"open_in_new_tab"`
		SortOrder    int    `json:"sort_order"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	h.db.Exec(r.Context(),
		`UPDATE social_links SET platform=$1, url=$2, label=$3, is_visible=$4, open_in_new_tab=$5, sort_order=$6, updated_at=NOW()
		 WHERE id=$7`,
		req.Platform, req.URL, req.Label, req.IsVisible, req.OpenInNewTab, req.SortOrder, id)
	response.Message(w, "social link updated")
}

func (h *AdminHandler) DeleteSocialLink(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM social_links WHERE id=$1`, id)
	response.NoContent(w)
}

// ── Navigation ────────────────────────────────────────────────────────────────

func (h *AdminHandler) ListNavigation(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, label, href, is_external, is_visible, sort_order
		 FROM navigation_items ORDER BY sort_order`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type NavItem struct {
		ID         string          `json:"id"`
		Label      json.RawMessage `json:"label"`
		Href       string          `json:"href"`
		IsExternal bool            `json:"is_external"`
		IsVisible  bool            `json:"is_visible"`
		SortOrder  int             `json:"sort_order"`
	}
	items := []NavItem{}
	for rows.Next() {
		var item NavItem
		var label []byte
		rows.Scan(&item.ID, &label, &item.Href, &item.IsExternal, &item.IsVisible, &item.SortOrder)
		item.Label = json.RawMessage(label)
		items = append(items, item)
	}
	response.Success(w, items)
}

func (h *AdminHandler) CreateNavItem(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	labelJSON, _ := json.Marshal(req["label"])
	h.db.Exec(r.Context(),
		`INSERT INTO navigation_items (label, href, is_external, is_visible, sort_order)
		 VALUES ($1,$2,$3,$4,$5)`,
		labelJSON, req["href"], req["is_external"], req["is_visible"], req["sort_order"])
	response.Created(w, map[string]string{"message": "nav item created"})
}

func (h *AdminHandler) UpdateNavItem(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	labelJSON, _ := json.Marshal(req["label"])
	h.db.Exec(r.Context(),
		`UPDATE navigation_items SET label=$1, href=$2, is_external=$3, is_visible=$4, sort_order=$5, updated_at=NOW()
		 WHERE id=$6`,
		labelJSON, req["href"], req["is_external"], req["is_visible"], req["sort_order"], id)
	response.Message(w, "nav item updated")
}

func (h *AdminHandler) DeleteNavItem(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM navigation_items WHERE id=$1`, id)
	response.NoContent(w)
}
