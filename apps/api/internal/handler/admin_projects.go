package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

func (h *AdminHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, slug, title, short_description,
		        COALESCE(cover_image_url,''), COALESCE(tech_stack,'{}'), COALESCE(tags,'{}'),
		        COALESCE(status,'published'), is_featured, is_visible, COALESCE(sort_order,0),
		        COALESCE(live_demo_url,''), COALESCE(repo_url,''),
		        COALESCE(TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '')
		 FROM projects ORDER BY sort_order ASC, created_at DESC`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Project struct {
		ID               string          `json:"id"`
		Slug             string          `json:"slug"`
		Title            json.RawMessage `json:"title"`
		ShortDescription json.RawMessage `json:"short_description"`
		CoverImageURL    string          `json:"cover_image_url"`
		TechStack        []string        `json:"tech_stack"`
		Tags             []string        `json:"tags"`
		Status           string          `json:"status"`
		IsFeatured       bool            `json:"is_featured"`
		IsVisible        bool            `json:"is_visible"`
		SortOrder        int             `json:"sort_order"`
		LiveDemoURL      string          `json:"live_demo_url"`
		RepoURL          string          `json:"repo_url"`
		CreatedAt        string          `json:"created_at"`
	}
	projects := []Project{}
	for rows.Next() {
		var p Project
		var title, shortDesc []byte
		if err := rows.Scan(&p.ID, &p.Slug, &title, &shortDesc, &p.CoverImageURL, &p.TechStack, &p.Tags,
			&p.Status, &p.IsFeatured, &p.IsVisible, &p.SortOrder, &p.LiveDemoURL, &p.RepoURL, &p.CreatedAt); err != nil {
			log.Printf("ListProjects scan error: %v", err)
			continue
		}
		p.Title = json.RawMessage(title)
		p.ShortDescription = json.RawMessage(shortDesc)
		projects = append(projects, p)
	}
	response.Success(w, projects)
}

func (h *AdminHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	row := h.db.QueryRow(r.Context(),
		`SELECT id, slug, title, short_description, full_description,
		        COALESCE(cover_image_url,''), COALESCE(tech_stack,'{}'), role, COALESCE(tags,'{}'),
		        COALESCE(status,'published'), is_featured, is_visible, COALESCE(sort_order,0),
		        COALESCE(live_demo_url,''), COALESCE(repo_url,''),
		        COALESCE(meta_title,''), COALESCE(meta_description,'')
		 FROM projects WHERE id=$1`, id)

	var pid, slug, coverImg, liveDemo, repoURL, metaTitle, metaDesc, status string
	var title, shortDesc, fullDesc, role []byte
	var techStack, tags []string
	var isFeatured, isVisible bool
	var sortOrder int
	if err := row.Scan(&pid, &slug, &title, &shortDesc, &fullDesc, &coverImg, &techStack, &role, &tags,
		&status, &isFeatured, &isVisible, &sortOrder, &liveDemo, &repoURL, &metaTitle, &metaDesc); err != nil {
		log.Printf("GetProject scan error for id=%s: %v", id, err)
		response.NotFound(w, "project not found")
		return
	}

	safeJSON := func(b []byte) json.RawMessage {
		if len(b) == 0 || string(b) == "null" {
			return json.RawMessage(`{"en":"","id":""}`)
		}
		return json.RawMessage(b)
	}
	response.Success(w, map[string]interface{}{
		"id": pid, "slug": slug,
		"title": safeJSON(title), "short_description": safeJSON(shortDesc),
		"full_description": safeJSON(fullDesc),
		"cover_image_url": coverImg, "tech_stack": techStack,
		"role": safeJSON(role), "tags": tags,
		"status": status, "is_featured": isFeatured, "is_visible": isVisible,
		"sort_order": sortOrder, "live_demo_url": liveDemo, "repo_url": repoURL,
		"meta_title": metaTitle, "meta_description": metaDesc,
	})
}

func (h *AdminHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	titleJSON, _ := json.Marshal(req["title"])
	shortDescJSON, _ := json.Marshal(req["short_description"])
	fullDescJSON, _ := json.Marshal(req["full_description"])
	roleJSON, _ := json.Marshal(req["role"])
	techStack := toStringSlice(req["tech_stack"])
	tags := toStringSlice(req["tags"])

	var newID string
	err := h.db.QueryRow(r.Context(),
		`INSERT INTO projects (slug, title, short_description, full_description, cover_image_url,
		        tech_stack, role, tags, status, is_featured, is_visible, sort_order,
		        live_demo_url, repo_url, meta_title, meta_description)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id`,
		req["slug"], titleJSON, shortDescJSON, fullDescJSON, req["cover_image_url"],
		techStack, roleJSON, tags, req["status"], req["is_featured"], req["is_visible"], req["sort_order"],
		req["live_demo_url"], req["repo_url"], req["meta_title"], req["meta_description"]).Scan(&newID)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	response.Created(w, map[string]string{"id": newID})
}

func (h *AdminHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	titleJSON, _ := json.Marshal(req["title"])
	shortDescJSON, _ := json.Marshal(req["short_description"])
	fullDescJSON, _ := json.Marshal(req["full_description"])
	roleJSON, _ := json.Marshal(req["role"])
	techStack := toStringSlice(req["tech_stack"])
	tags := toStringSlice(req["tags"])

	h.db.Exec(r.Context(),
		`UPDATE projects SET slug=$1, title=$2, short_description=$3, full_description=$4,
		        cover_image_url=$5, tech_stack=$6, role=$7, tags=$8, status=$9,
		        is_featured=$10, is_visible=$11, sort_order=$12,
		        live_demo_url=$13, repo_url=$14, meta_title=$15, meta_description=$16,
		        updated_at=NOW()
		 WHERE id=$17`,
		req["slug"], titleJSON, shortDescJSON, fullDescJSON, req["cover_image_url"],
		techStack, roleJSON, tags, req["status"], req["is_featured"], req["is_visible"], req["sort_order"],
		req["live_demo_url"], req["repo_url"], req["meta_title"], req["meta_description"], id)
	response.Message(w, "project updated")
}

func (h *AdminHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM projects WHERE id=$1`, id)
	response.NoContent(w)
}
