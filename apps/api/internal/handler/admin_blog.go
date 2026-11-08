package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/alexdev/portfolio/pkg/response"
	"github.com/go-chi/chi/v5"
)

func (h *AdminHandler) ListBlogPosts(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, slug, title, excerpt, COALESCE(cover_image_url,''), COALESCE(tags,'{}'),
		        COALESCE(status,'draft'), is_featured, is_visible,
		        COALESCE(TO_CHAR(published_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), ''),
		        COALESCE(TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '')
		 FROM blog_posts ORDER BY created_at DESC`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Post struct {
		ID            string          `json:"id"`
		Slug          string          `json:"slug"`
		Title         json.RawMessage `json:"title"`
		Excerpt       json.RawMessage `json:"excerpt"`
		CoverImageURL string          `json:"cover_image_url"`
		Tags          []string        `json:"tags"`
		Status        string          `json:"status"`
		IsFeatured    bool            `json:"is_featured"`
		IsVisible     bool            `json:"is_visible"`
		PublishedAt   string          `json:"published_at"`
		CreatedAt     string          `json:"created_at"`
	}
	posts := []Post{}
	for rows.Next() {
		var p Post
		var title, excerpt []byte
		if err := rows.Scan(&p.ID, &p.Slug, &title, &excerpt, &p.CoverImageURL, &p.Tags,
			&p.Status, &p.IsFeatured, &p.IsVisible, &p.PublishedAt, &p.CreatedAt); err != nil {
			log.Printf("ListBlogPosts scan error: %v", err)
			continue
		}
		p.Title = json.RawMessage(title)
		p.Excerpt = json.RawMessage(excerpt)
		posts = append(posts, p)
	}
	response.Success(w, posts)
}

func (h *AdminHandler) GetBlogPost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	row := h.db.QueryRow(r.Context(),
		`SELECT id, slug, title, excerpt, content, COALESCE(cover_image_url,''), COALESCE(tags,'{}'),
		        COALESCE(status,'draft'), is_featured, is_visible, published_at,
		        COALESCE(meta_title,''), COALESCE(meta_description,''), COALESCE(og_image_url,'')
		 FROM blog_posts WHERE id=$1`, id)

	var pid, slug, coverImg, status, metaTitle, metaDesc, ogImg string
	var title, excerpt, content []byte
	var tags []string
	var isFeatured, isVisible bool
	var publishedAt *string
	if err := row.Scan(&pid, &slug, &title, &excerpt, &content, &coverImg, &tags, &status,
		&isFeatured, &isVisible, &publishedAt, &metaTitle, &metaDesc, &ogImg); err != nil {
		log.Printf("GetBlogPost scan error for id=%s: %v", id, err)
		response.NotFound(w, "blog post not found")
		return
	}
	response.Success(w, map[string]interface{}{
		"id": pid, "slug": slug,
		"title": json.RawMessage(title), "excerpt": json.RawMessage(excerpt),
		"content":         json.RawMessage(content),
		"cover_image_url": coverImg, "tags": tags, "status": status,
		"is_featured": isFeatured, "is_visible": isVisible, "published_at": publishedAt,
		"meta_title": metaTitle, "meta_description": metaDesc, "og_image_url": ogImg,
	})
}

func (h *AdminHandler) CreateBlogPost(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	titleJSON, _ := json.Marshal(req["title"])
	excerptJSON, _ := json.Marshal(req["excerpt"])
	contentJSON, _ := json.Marshal(req["content"])
	tags := toStringSlice(req["tags"])

	var newID string
	err := h.db.QueryRow(r.Context(),
		`INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, tags, status,
		        is_featured, is_visible, published_at, meta_title, meta_description, og_image_url)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
		req["slug"], titleJSON, excerptJSON, contentJSON, req["cover_image_url"],
		tags, req["status"], req["is_featured"], req["is_visible"], req["published_at"],
		req["meta_title"], req["meta_description"], req["og_image_url"]).Scan(&newID)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	response.Created(w, map[string]string{"id": newID})
}

func (h *AdminHandler) UpdateBlogPost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	titleJSON, _ := json.Marshal(req["title"])
	excerptJSON, _ := json.Marshal(req["excerpt"])
	contentJSON, _ := json.Marshal(req["content"])
	tags := toStringSlice(req["tags"])

	h.db.Exec(r.Context(),
		`UPDATE blog_posts SET slug=$1, title=$2, excerpt=$3, content=$4, cover_image_url=$5,
		        tags=$6, status=$7, is_featured=$8, is_visible=$9, published_at=$10,
		        meta_title=$11, meta_description=$12, og_image_url=$13, updated_at=NOW()
		 WHERE id=$14`,
		req["slug"], titleJSON, excerptJSON, contentJSON, req["cover_image_url"],
		tags, req["status"], req["is_featured"], req["is_visible"], req["published_at"],
		req["meta_title"], req["meta_description"], req["og_image_url"], id)
	response.Message(w, "blog post updated")
}

func (h *AdminHandler) DeleteBlogPost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	h.db.Exec(r.Context(), `DELETE FROM blog_posts WHERE id=$1`, id)
	response.NoContent(w)
}
