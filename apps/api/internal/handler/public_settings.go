package handler

import (
	"encoding/json"
	"net/http"

	"github.com/alexdev/portfolio/pkg/response"
)

// GetSettings returns site settings, theme, and language config.
func (h *PublicHandler) GetSettings(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Site     map[string]interface{} `json:"site"`
		Theme    map[string]interface{} `json:"theme"`
		Language map[string]interface{} `json:"language"`
	}

	site := make(map[string]interface{})
	row := h.db.QueryRow(r.Context(),
		`SELECT site_name, brand_name, full_name, title, contact_email, location,
		        availability_status, is_available, footer_text,
		        cta_primary_label, cta_secondary_label, default_language, default_theme
		 FROM site_settings WHERE id = 1`)
	var sn, bn, fn, t, ce, loc, avs, ft, cpL, csL, dl, dt string
	var ia bool
	if err := row.Scan(&sn, &bn, &fn, &t, &ce, &loc, &avs, &ia, &ft, &cpL, &csL, &dl, &dt); err == nil {
		site = map[string]interface{}{
			"site_name": sn, "brand_name": bn, "full_name": fn, "title": t,
			"contact_email": ce, "location": loc, "availability_status": avs,
			"is_available": ia, "footer_text": ft,
			"cta_primary_label": cpL, "cta_secondary_label": csL,
			"default_language": dl, "default_theme": dt,
		}
	}

	theme := make(map[string]interface{})
	tRow := h.db.QueryRow(r.Context(),
		`SELECT enable_theme_switcher, default_theme, accent_preset FROM theme_settings WHERE id = 1`)
	var ets bool
	var dth, ap string
	if err := tRow.Scan(&ets, &dth, &ap); err == nil {
		theme = map[string]interface{}{"enable_theme_switcher": ets, "default_theme": dth, "accent_preset": ap}
	}

	lang := make(map[string]interface{})
	lRow := h.db.QueryRow(r.Context(),
		`SELECT default_language, enable_language_switcher, active_languages FROM language_settings WHERE id = 1`)
	var dlang string
	var els bool
	var activelangs []string
	if err := lRow.Scan(&dlang, &els, &activelangs); err == nil {
		lang = map[string]interface{}{"default_language": dlang, "enable_language_switcher": els, "active_languages": activelangs}
	}

	result.Site = site
	result.Theme = theme
	result.Language = lang
	response.Success(w, result)
}

// GetHero returns hero section content.
func (h *PublicHandler) GetHero(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT headline, subheadline, short_intro, availability_badge, show_availability_badge, profile_image_url
		 FROM hero_content WHERE id = 1`)
	var headline, subheadline, shortIntro, availBadge []byte
	var showBadge bool
	var profileImg string
	if err := row.Scan(&headline, &subheadline, &shortIntro, &availBadge, &showBadge, &profileImg); err != nil {
		response.NotFound(w, "hero content not found")
		return
	}
	response.Success(w, map[string]interface{}{
		"headline": json.RawMessage(headline), "subheadline": json.RawMessage(subheadline),
		"short_intro": json.RawMessage(shortIntro), "availability_badge": json.RawMessage(availBadge),
		"show_availability_badge": showBadge, "profile_image_url": profileImg,
	})
}

// GetAbout returns about content.
func (h *PublicHandler) GetAbout(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT short_bio, full_bio, highlights, profile_image_url, years_of_experience
		 FROM about_content WHERE id = 1`)
	var shortBio, fullBio, highlights []byte
	var profileImg string
	var yearsExp int
	if err := row.Scan(&shortBio, &fullBio, &highlights, &profileImg, &yearsExp); err != nil {
		response.NotFound(w, "about content not found")
		return
	}
	response.Success(w, map[string]interface{}{
		"short_bio": json.RawMessage(shortBio), "full_bio": json.RawMessage(fullBio),
		"highlights": json.RawMessage(highlights), "profile_image_url": profileImg,
		"years_of_experience": yearsExp,
	})
}

// GetSections returns section visibility map.
func (h *PublicHandler) GetSections(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT section_key, is_visible FROM section_settings ORDER BY sort_order`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()

	sections := map[string]bool{}
	for rows.Next() {
		var key string
		var visible bool
		rows.Scan(&key, &visible)
		sections[key] = visible
	}
	response.Success(w, sections)
}

// GetResumeSettings returns public resume/CV settings.
func (h *PublicHandler) GetResumeSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT enable_cv_download, cv_url, cv_url_id, button_label, cv_source, cv_template, cv_page_size, cv_builder_data FROM resume_settings WHERE id = 1`)
	var cvURL, cvURLID, cvSource, cvTemplate, cvPageSize string
	var buttonLabel, cvBuilderData []byte
	var enableDownload bool
	if err := row.Scan(&enableDownload, &cvURL, &cvURLID, &buttonLabel, &cvSource, &cvTemplate, &cvPageSize, &cvBuilderData); err != nil {
		response.InternalServerError(w)
		return
	}
	if cvSource == "" {
		cvSource = "url"
	}
	if cvTemplate == "" {
		cvTemplate = "classic"
	}
	if cvPageSize == "" {
		cvPageSize = "A4"
	}
	if len(cvBuilderData) == 0 {
		cvBuilderData = []byte("{}")
	}
	response.Success(w, map[string]interface{}{
		"enable_cv_download": enableDownload,
		"cv_url":             cvURL,
		"cv_url_id":          cvURLID,
		"button_label":       json.RawMessage(buttonLabel),
		"cv_source":          cvSource,
		"cv_template":        cvTemplate,
		"cv_page_size":       cvPageSize,
		"cv_builder_data":    json.RawMessage(cvBuilderData),
	})
}

// GetNavigation returns all visible navigation items.
func (h *PublicHandler) GetNavigation(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, label, href, is_external FROM navigation_items WHERE is_visible = true ORDER BY sort_order`)
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
	}
	items := []NavItem{}
	for rows.Next() {
		var item NavItem
		var label []byte
		rows.Scan(&item.ID, &label, &item.Href, &item.IsExternal)
		item.Label = json.RawMessage(label)
		items = append(items, item)
	}
	response.Success(w, items)
}
