package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// GetBlogPosts returns published, visible blog posts.
func (h *PublicHandler) GetBlogPosts(w http.ResponseWriter, r *http.Request) {
	var sectionVisible bool
	h.db.QueryRow(r.Context(),
		`SELECT is_visible FROM section_settings WHERE section_key = 'blog_page'`).Scan(&sectionVisible)
	if !sectionVisible {
		response.Success(w, []interface{}{})
		return
	}

	rows, err := h.db.Query(r.Context(),
		`SELECT id, slug, title, excerpt, COALESCE(cover_image_url,''), tags, is_featured, published_at, COALESCE(meta_title,'')
		 FROM blog_posts WHERE is_visible = true AND status = 'published'
		 ORDER BY is_featured DESC, published_at DESC`)
	if err != nil {
		log.Printf("GetBlogPosts query error: %v", err)
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
		IsFeatured    bool            `json:"is_featured"`
		PublishedAt   *string         `json:"published_at"`
		MetaTitle     string          `json:"meta_title"`
	}

	posts := []Post{}
	for rows.Next() {
		var p Post
		var title, excerpt []byte
		if err := rows.Scan(&p.ID, &p.Slug, &title, &excerpt, &p.CoverImageURL, &p.Tags, &p.IsFeatured, &p.PublishedAt, &p.MetaTitle); err != nil {
			log.Printf("GetBlogPosts scan error: %v", err)
			continue
		}
		p.Title = json.RawMessage(title)
		p.Excerpt = json.RawMessage(excerpt)
		posts = append(posts, p)
	}
	response.Success(w, posts)
}

// GetBlogPostBySlug returns a single blog post.
func (h *PublicHandler) GetBlogPostBySlug(w http.ResponseWriter, r *http.Request) {
	var sectionVisible bool
	h.db.QueryRow(r.Context(),
		`SELECT is_visible FROM section_settings WHERE section_key = 'blog_page'`).Scan(&sectionVisible)
	if !sectionVisible {
		response.NotFound(w, "blog not available")
		return
	}

	slug := chi.URLParam(r, "slug")
	row := h.db.QueryRow(r.Context(),
		`SELECT id, slug, title, excerpt, content, COALESCE(cover_image_url,''), tags,
		        published_at, COALESCE(meta_title,''), COALESCE(meta_description,''), COALESCE(og_image_url,'')
		 FROM blog_posts WHERE slug = $1 AND is_visible = true AND status = 'published'`, slug)

	var id, postSlug, coverImg, metaTitle, metaDesc, ogImg string
	var publishedAt *string
	var title, excerpt, content []byte
	var tags []string
	if err := row.Scan(&id, &postSlug, &title, &excerpt, &content, &coverImg, &tags, &publishedAt, &metaTitle, &metaDesc, &ogImg); err != nil {
		log.Printf("GetBlogPostBySlug scan error for slug=%s: %v", slug, err)
		response.NotFound(w, "blog post not found")
		return
	}

	response.Success(w, map[string]interface{}{
		"id": id, "slug": postSlug,
		"title": json.RawMessage(title), "excerpt": json.RawMessage(excerpt),
		"content":         json.RawMessage(content),
		"cover_image_url": coverImg, "tags": tags,
		"published_at": publishedAt, "meta_title": metaTitle,
		"meta_description": metaDesc, "og_image_url": ogImg,
	})
}
