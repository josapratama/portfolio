package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// GetSkills returns all visible skills grouped by category.
func (h *PublicHandler) GetSkills(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT sc.id, sc.name, sc.sort_order,
		        s.id, s.name, s.icon, s.proficiency_level, s.is_featured, s.sort_order
		 FROM skill_categories sc
		 LEFT JOIN skills s ON s.category_id = sc.id AND s.is_visible = true
		 ORDER BY sc.sort_order, s.sort_order NULLS LAST`)
	if err != nil {
		log.Printf("GetSkills query error: %v", err)
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Skill struct {
		ID               string          `json:"id"`
		Name             json.RawMessage `json:"name"`
		Icon             string          `json:"icon"`
		ProficiencyLevel string          `json:"proficiency_level"`
		IsFeatured       bool            `json:"is_featured"`
		SortOrder        int             `json:"sort_order"`
	}
	type Category struct {
		ID        string          `json:"id"`
		Name      json.RawMessage `json:"name"`
		SortOrder int             `json:"sort_order"`
		Skills    []Skill         `json:"skills"`
	}

	catMap := map[string]*Category{}
	catOrder := []string{}

	for rows.Next() {
		var catID string
		var catName []byte
		var catSort int
		var skillID *string
		var skillName []byte
		var skillIcon, skillProf *string
		var skillFeatured *bool
		var skillSort *int

		if err := rows.Scan(&catID, &catName, &catSort, &skillID, &skillName, &skillIcon, &skillProf, &skillFeatured, &skillSort); err != nil {
			continue
		}
		if _, ok := catMap[catID]; !ok {
			catMap[catID] = &Category{ID: catID, Name: json.RawMessage(catName), SortOrder: catSort, Skills: []Skill{}}
			catOrder = append(catOrder, catID)
		}
		if skillID != nil && len(skillName) > 0 {
			icon := ""
			if skillIcon != nil {
				icon = *skillIcon
			}
			prof := ""
			if skillProf != nil {
				prof = *skillProf
			}
			featured := false
			if skillFeatured != nil {
				featured = *skillFeatured
			}
			sortOrd := 0
			if skillSort != nil {
				sortOrd = *skillSort
			}
			catMap[catID].Skills = append(catMap[catID].Skills, Skill{
				ID: *skillID, Name: json.RawMessage(skillName), Icon: icon,
				ProficiencyLevel: prof, IsFeatured: featured, SortOrder: sortOrd,
			})
		}
	}

	result := make([]Category, 0, len(catOrder))
	for _, id := range catOrder {
		result = append(result, *catMap[id])
	}
	response.Success(w, result)
}

// GetProjects returns visible, published projects.
func (h *PublicHandler) GetProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, slug, title, short_description,
		        COALESCE(cover_image_url,''), COALESCE(tech_stack,'{}'), is_featured,
		        COALESCE(sort_order,0), COALESCE(live_demo_url,''), COALESCE(repo_url,''), COALESCE(tags,'{}')
		 FROM projects WHERE is_visible = true AND status = 'published'
		 ORDER BY is_featured DESC, sort_order ASC`)
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
		IsFeatured       bool            `json:"is_featured"`
		SortOrder        int             `json:"sort_order"`
		LiveDemoURL      string          `json:"live_demo_url"`
		RepoURL          string          `json:"repo_url"`
		Tags             []string        `json:"tags"`
	}

	projects := []Project{}
	for rows.Next() {
		var p Project
		var title, shortDesc []byte
		if err := rows.Scan(&p.ID, &p.Slug, &title, &shortDesc, &p.CoverImageURL, &p.TechStack, &p.IsFeatured, &p.SortOrder, &p.LiveDemoURL, &p.RepoURL, &p.Tags); err != nil {
			continue
		}
		p.Title = json.RawMessage(title)
		p.ShortDescription = json.RawMessage(shortDesc)
		projects = append(projects, p)
	}
	response.Success(w, projects)
}

// GetProjectBySlug returns a single project detail.
func (h *PublicHandler) GetProjectBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	row := h.db.QueryRow(r.Context(),
		`SELECT id, slug, title, short_description, full_description,
		        COALESCE(cover_image_url,''), COALESCE(tech_stack,'{}'), role, COALESCE(tags,'{}'),
		        COALESCE(live_demo_url,''), COALESCE(repo_url,''),
		        COALESCE(meta_title,''), COALESCE(meta_description,'')
		 FROM projects WHERE slug = $1 AND is_visible = true AND status = 'published'`, slug)

	var id, projectSlug, coverImg, liveDemo, repoURL, metaTitle, metaDesc string
	var title, shortDesc, fullDesc, role []byte
	var techStack, tags []string
	if err := row.Scan(&id, &projectSlug, &title, &shortDesc, &fullDesc, &coverImg, &techStack, &role, &tags, &liveDemo, &repoURL, &metaTitle, &metaDesc); err != nil {
		response.NotFound(w, "project not found")
		return
	}

	type Image struct {
		URL string `json:"url"`
		Alt string `json:"alt"`
	}
	images := []Image{}
	imgRows, err := h.db.Query(r.Context(),
		`SELECT url, alt FROM project_images WHERE project_id = $1 ORDER BY sort_order`, id)
	if err == nil {
		defer imgRows.Close()
		for imgRows.Next() {
			var img Image
			imgRows.Scan(&img.URL, &img.Alt)
			images = append(images, img)
		}
	}

	response.Success(w, map[string]interface{}{
		"id": id, "slug": projectSlug,
		"title": json.RawMessage(title), "short_description": json.RawMessage(shortDesc),
		"full_description": json.RawMessage(fullDesc),
		"cover_image_url": coverImg, "tech_stack": techStack,
		"role": json.RawMessage(role), "tags": tags,
		"live_demo_url": liveDemo, "repo_url": repoURL,
		"meta_title": metaTitle, "meta_description": metaDesc,
		"images": images,
	})
}

// GetExperiences returns all visible experiences.
func (h *PublicHandler) GetExperiences(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, organization, role, location, employment_type,
		        TO_CHAR(start_date, 'YYYY-MM-DD'), TO_CHAR(end_date, 'YYYY-MM-DD'),
		        is_current, description, achievements
		 FROM experiences WHERE is_visible = true ORDER BY sort_order ASC, start_date DESC`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	type Experience struct {
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
	}

	experiences := []Experience{}
	for rows.Next() {
		var e Experience
		var org, role, loc, desc, ach []byte
		var endDate *string
		if err := rows.Scan(&e.ID, &org, &role, &loc, &e.EmploymentType, &e.StartDate, &endDate, &e.IsCurrent, &desc, &ach); err != nil {
			continue
		}
		e.Organization = json.RawMessage(org)
		e.Role = json.RawMessage(role)
		e.Location = json.RawMessage(loc)
		e.Description = json.RawMessage(desc)
		e.Achievements = json.RawMessage(ach)
		e.EndDate = endDate
		experiences = append(experiences, e)
	}
	response.Success(w, experiences)
}
