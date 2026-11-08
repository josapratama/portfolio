package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/alexdev/portfolio/pkg/response"
)

// ── Site Settings ─────────────────────────────────────────────────────────────

func (h *AdminHandler) GetSiteSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT site_name, brand_name, full_name, title, contact_email, location,
		        availability_status, is_available, footer_text,
		        cta_primary_label, cta_secondary_label, default_language, default_theme,
		        COALESCE(logo_url,''), COALESCE(favicon_url,'')
		 FROM site_settings WHERE id = 1`)
	var sn, bn, fn, t, ce, loc, avs, ft, cpL, csL, dl, dt, lu, fav string
	var ia bool
	if err := row.Scan(&sn, &bn, &fn, &t, &ce, &loc, &avs, &ia, &ft, &cpL, &csL, &dl, &dt, &lu, &fav); err != nil {
		response.InternalServerError(w)
		return
	}
	response.Success(w, map[string]interface{}{
		"site_name": sn, "brand_name": bn, "full_name": fn, "title": t,
		"contact_email": ce, "location": loc, "availability_status": avs,
		"is_available": ia, "footer_text": ft,
		"cta_primary_label": cpL, "cta_secondary_label": csL,
		"default_language": dl, "default_theme": dt,
		"logo_url": lu, "favicon_url": fav,
	})
}

func (h *AdminHandler) UpdateSiteSettings(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	_, err := h.db.Exec(r.Context(),
		`UPDATE site_settings SET
		        site_name=$1, brand_name=$2, full_name=$3, title=$4, contact_email=$5,
		        location=$6, availability_status=$7, is_available=$8, footer_text=$9,
		        cta_primary_label=$10, cta_secondary_label=$11, default_language=$12,
		        default_theme=$13, logo_url=$14, favicon_url=$15, updated_at=NOW()
		 WHERE id=1`,
		req["site_name"], req["brand_name"], req["full_name"], req["title"],
		req["contact_email"], req["location"], req["availability_status"],
		req["is_available"], req["footer_text"],
		req["cta_primary_label"], req["cta_secondary_label"],
		req["default_language"], req["default_theme"],
		req["logo_url"], req["favicon_url"])
	if err != nil {
		response.InternalServerError(w)
		return
	}
	response.Message(w, "site settings updated")
}

// ── Theme Settings ────────────────────────────────────────────────────────────

func (h *AdminHandler) GetThemeSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT enable_theme_switcher, default_theme, accent_preset FROM theme_settings WHERE id = 1`)
	var dt, ap string
	var ets bool
	row.Scan(&ets, &dt, &ap)
	response.Success(w, map[string]interface{}{"enable_theme_switcher": ets, "default_theme": dt, "accent_preset": ap})
}

func (h *AdminHandler) UpdateThemeSettings(w http.ResponseWriter, r *http.Request) {
	var req struct {
		EnableThemeSwitcher bool   `json:"enable_theme_switcher"`
		DefaultTheme        string `json:"default_theme"`
		AccentPreset        string `json:"accent_preset"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	h.db.Exec(r.Context(),
		`UPDATE theme_settings SET enable_theme_switcher=$1, default_theme=$2, accent_preset=$3, updated_at=NOW() WHERE id=1`,
		req.EnableThemeSwitcher, req.DefaultTheme, req.AccentPreset)
	response.Message(w, "theme settings updated")
}

// ── Language Settings ─────────────────────────────────────────────────────────

func (h *AdminHandler) GetLanguageSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT default_language, enable_language_switcher, active_languages FROM language_settings WHERE id = 1`)
	var dl string
	var els bool
	var al []string
	row.Scan(&dl, &els, &al)
	response.Success(w, map[string]interface{}{"default_language": dl, "enable_language_switcher": els, "active_languages": al})
}

func (h *AdminHandler) UpdateLanguageSettings(w http.ResponseWriter, r *http.Request) {
	var req struct {
		DefaultLanguage        string   `json:"default_language"`
		EnableLanguageSwitcher bool     `json:"enable_language_switcher"`
		ActiveLanguages        []string `json:"active_languages"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	h.db.Exec(r.Context(),
		`UPDATE language_settings SET default_language=$1, enable_language_switcher=$2, active_languages=$3, updated_at=NOW() WHERE id=1`,
		req.DefaultLanguage, req.EnableLanguageSwitcher, req.ActiveLanguages)
	response.Message(w, "language settings updated")
}

// ── SEO Settings ──────────────────────────────────────────────────────────────

func (h *AdminHandler) GetSEOSettings(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT COALESCE(meta_title,''), COALESCE(meta_description,''),
		        COALESCE(og_title,''), COALESCE(og_description,''),
		        COALESCE(og_image_url,''), COALESCE(twitter_card,''),
		        COALESCE(canonical_url,'')
		 FROM seo_settings WHERE id = 1`)
	var mt, md, ot, od, oi, tc, cu string
	row.Scan(&mt, &md, &ot, &od, &oi, &tc, &cu)
	response.Success(w, map[string]interface{}{
		"meta_title": mt, "meta_description": md, "og_title": ot, "og_description": od,
		"og_image_url": oi, "twitter_card": tc, "canonical_url": cu,
	})
}

func (h *AdminHandler) UpdateSEOSettings(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)
	h.db.Exec(r.Context(),
		`UPDATE seo_settings SET meta_title=$1, meta_description=$2, og_title=$3, og_description=$4, og_image_url=$5, twitter_card=$6, canonical_url=$7, updated_at=NOW() WHERE id=1`,
		req["meta_title"], req["meta_description"], req["og_title"], req["og_description"],
		req["og_image_url"], req["twitter_card"], req["canonical_url"])
	response.Message(w, "SEO settings updated")
}

// ── Section Settings ──────────────────────────────────────────────────────────

func (h *AdminHandler) GetSections(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, section_key, label, is_visible, sort_order FROM section_settings ORDER BY sort_order`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer rows.Close()
	type Section struct {
		ID         string `json:"id"`
		SectionKey string `json:"section_key"`
		Label      string `json:"label"`
		IsVisible  bool   `json:"is_visible"`
		SortOrder  int    `json:"sort_order"`
	}
	sections := []Section{}
	for rows.Next() {
		var s Section
		rows.Scan(&s.ID, &s.SectionKey, &s.Label, &s.IsVisible, &s.SortOrder)
		sections = append(sections, s)
	}
	response.Success(w, sections)
}

func (h *AdminHandler) UpdateSection(w http.ResponseWriter, r *http.Request) {
	key := chi.URLParam(r, "key")
	var req struct {
		IsVisible bool `json:"is_visible"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	h.db.Exec(r.Context(),
		`UPDATE section_settings SET is_visible=$1, updated_at=NOW() WHERE section_key=$2`,
		req.IsVisible, key)
	response.Message(w, "section updated")
}

// ── Resume Settings ───────────────────────────────────────────────────────────

func (h *AdminHandler) GetResumeSettings(w http.ResponseWriter, r *http.Request) {
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
		"enable_cv_download": enableDownload, "cv_url": cvURL,
		"cv_url_id": cvURLID, "button_label": json.RawMessage(buttonLabel),
		"cv_source": cvSource, "cv_template": cvTemplate,
		"cv_page_size": cvPageSize, "cv_builder_data": json.RawMessage(cvBuilderData),
	})
}

func (h *AdminHandler) UpdateResumeSettings(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	buttonLabelJSON, _ := json.Marshal(req["button_label"])
	cvSource, _ := req["cv_source"].(string)
	if cvSource == "" {
		cvSource = "url"
	}
	cvTemplate, _ := req["cv_template"].(string)
	if cvTemplate == "" {
		cvTemplate = "classic"
	}
	cvPageSize, _ := req["cv_page_size"].(string)
	if cvPageSize == "" {
		cvPageSize = "A4"
	}
	if req["cv_builder_data"] != nil {
		cvBuilderDataJSON, _ := json.Marshal(req["cv_builder_data"])
		h.db.Exec(r.Context(),
			`UPDATE resume_settings SET enable_cv_download=$1, cv_url=$2, cv_url_id=$3, button_label=$4, cv_source=$5, cv_template=$6, cv_page_size=$7, cv_builder_data=$8, updated_at=NOW() WHERE id=1`,
			req["enable_cv_download"], req["cv_url"], req["cv_url_id"], buttonLabelJSON, cvSource, cvTemplate, cvPageSize, cvBuilderDataJSON)
	} else {
		h.db.Exec(r.Context(),
			`UPDATE resume_settings SET enable_cv_download=$1, cv_url=$2, cv_url_id=$3, button_label=$4, cv_source=$5, cv_template=$6, cv_page_size=$7, updated_at=NOW() WHERE id=1`,
			req["enable_cv_download"], req["cv_url"], req["cv_url_id"], buttonLabelJSON, cvSource, cvTemplate, cvPageSize)
	}
	response.Message(w, "resume settings updated")
}

// ── Hero ──────────────────────────────────────────────────────────────────────

func (h *AdminHandler) GetHero(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT headline, subheadline, short_intro, availability_badge, show_availability_badge, profile_image_url
		 FROM hero_content WHERE id = 1`)
	var headline, subheadline, shortIntro, availBadge []byte
	var showBadge bool
	var profileImg string
	row.Scan(&headline, &subheadline, &shortIntro, &availBadge, &showBadge, &profileImg)
	response.Success(w, map[string]interface{}{
		"headline": json.RawMessage(headline), "subheadline": json.RawMessage(subheadline),
		"short_intro": json.RawMessage(shortIntro), "availability_badge": json.RawMessage(availBadge),
		"show_availability_badge": showBadge, "profile_image_url": profileImg,
	})
}

func (h *AdminHandler) UpdateHero(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	headlineJSON, _ := json.Marshal(req["headline"])
	subheadlineJSON, _ := json.Marshal(req["subheadline"])
	shortIntroJSON, _ := json.Marshal(req["short_intro"])
	availBadgeJSON, _ := json.Marshal(req["availability_badge"])
	h.db.Exec(r.Context(),
		`UPDATE hero_content SET headline=$1, subheadline=$2, short_intro=$3, availability_badge=$4, show_availability_badge=$5, profile_image_url=$6, updated_at=NOW() WHERE id=1`,
		headlineJSON, subheadlineJSON, shortIntroJSON, availBadgeJSON,
		req["show_availability_badge"], req["profile_image_url"])
	response.Message(w, "hero content updated")
}

// ── About ─────────────────────────────────────────────────────────────────────

func (h *AdminHandler) GetAbout(w http.ResponseWriter, r *http.Request) {
	row := h.db.QueryRow(r.Context(),
		`SELECT short_bio, full_bio, highlights, profile_image_url, years_of_experience
		 FROM about_content WHERE id = 1`)
	var shortBio, fullBio, highlights []byte
	var profileImg string
	var yearsExp int
	row.Scan(&shortBio, &fullBio, &highlights, &profileImg, &yearsExp)
	response.Success(w, map[string]interface{}{
		"short_bio": json.RawMessage(shortBio), "full_bio": json.RawMessage(fullBio),
		"highlights": json.RawMessage(highlights), "profile_image_url": profileImg,
		"years_of_experience": yearsExp,
	})
}

func (h *AdminHandler) UpdateAbout(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	shortBioJSON, _ := json.Marshal(req["short_bio"])
	fullBioJSON, _ := json.Marshal(req["full_bio"])
	yearsExp := 0
	if v, ok := req["years_of_experience"]; ok {
		if val, ok := v.(float64); ok {
			yearsExp = int(val)
		}
	}
	if req["highlights"] != nil {
		highlightsJSON, _ := json.Marshal(req["highlights"])
		h.db.Exec(r.Context(),
			`UPDATE about_content SET short_bio=$1, full_bio=$2, highlights=$3, profile_image_url=$4, years_of_experience=$5, updated_at=NOW() WHERE id=1`,
			shortBioJSON, fullBioJSON, highlightsJSON, req["profile_image_url"], yearsExp)
	} else {
		h.db.Exec(r.Context(),
			`UPDATE about_content SET short_bio=$1, full_bio=$2, profile_image_url=$3, years_of_experience=$4, updated_at=NOW() WHERE id=1`,
			shortBioJSON, fullBioJSON, req["profile_image_url"], yearsExp)
	}
	response.Message(w, "about content updated")
}
