package routes

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/alexdev/portfolio/config"
	"github.com/alexdev/portfolio/internal/handler"
	"github.com/alexdev/portfolio/internal/middleware"
	"github.com/alexdev/portfolio/pkg/email"
	"github.com/alexdev/portfolio/pkg/response"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(db *pgxpool.Pool) http.Handler {
	r := chi.NewRouter()

	frontendURL := strings.TrimRight(config.Cfg.FrontendURL, "/")
	allowedOrigins := []string{
		frontendURL,
		frontendURL + "/",
		"http://localhost:5173",
		"http://localhost:3000",
	}
	if strings.HasPrefix(frontendURL, "https://") {
		httpVariant := "http://" + strings.TrimPrefix(frontendURL, "https://")
		allowedOrigins = append(allowedOrigins, httpVariant, httpVariant+"/")
	} else if strings.HasPrefix(frontendURL, "http://") {
		httpsVariant := "https://" + strings.TrimPrefix(frontendURL, "http://")
		allowedOrigins = append(allowedOrigins, httpsVariant, httpsVariant+"/")
	}

	// Global Middleware
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Handlers
	mailer := email.New()
	authH := handler.NewAuthHandler(db)
	publicH := handler.NewPublicHandler(db, mailer)
	adminH := handler.NewAdminHandler(db)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		response.Success(w, map[string]string{"status": "ok"})
	})

	// ============================================================
	// AUTH ROUTES
	// ============================================================
	r.Route("/api/v1/auth", func(r chi.Router) {
		r.Post("/login", authH.Login)
		r.Post("/refresh", authH.Refresh)
		r.Get("/authhub/config", authH.AuthHubConfig)
		r.Post("/authhub/callback", authH.AuthHubCallback)
		r.With(middleware.AuthRequired).Post("/logout", authH.Logout)
		r.With(middleware.AuthRequired).Get("/me", authH.Me)
	})

	// ============================================================
	// PUBLIC ROUTES (no auth)
	// ============================================================
	r.Route("/api/v1/public", func(r chi.Router) {
		r.Get("/settings", publicH.GetSettings)
		r.Get("/hero", publicH.GetHero)
		r.Get("/about", publicH.GetAbout)
		r.Get("/skills", publicH.GetSkills)
		r.Get("/projects", publicH.GetProjects)
		r.Get("/projects/{slug}", publicH.GetProjectBySlug)
		r.Get("/experiences", publicH.GetExperiences)
		r.Get("/blog", publicH.GetBlogPosts)
		r.Get("/blog/{slug}", publicH.GetBlogPostBySlug)
		r.Get("/social-links", publicH.GetSocialLinks)
		r.Get("/navigation", publicH.GetNavigation)
		r.Get("/sections", publicH.GetSections)
		r.Get("/contact-settings", publicH.GetContactSettings)
		r.Get("/resume", publicH.GetResumeSettings)
		r.Post("/contact", publicH.SubmitContact)
	})

	// ============================================================
	// ADMIN ROUTES (JWT auth required)
	// ============================================================
	r.Route("/api/v1/admin", func(r chi.Router) {
		r.Use(middleware.AuthRequired)

		// Dashboard
		r.Get("/dashboard", adminH.GetDashboard)

		// Settings
		r.Get("/settings/site", adminH.GetSiteSettings)
		r.Put("/settings/site", adminH.UpdateSiteSettings)
		r.Get("/settings/theme", adminH.GetThemeSettings)
		r.Put("/settings/theme", adminH.UpdateThemeSettings)
		r.Get("/settings/language", adminH.GetLanguageSettings)
		r.Put("/settings/language", adminH.UpdateLanguageSettings)
		r.Get("/settings/seo", adminH.GetSEOSettings)
		r.Put("/settings/seo", adminH.UpdateSEOSettings)

		// Sections
		r.Get("/sections", adminH.GetSections)
		r.Put("/sections/{key}", adminH.UpdateSection)

		// Hero
		r.Get("/hero", adminH.GetHero)
		r.Put("/hero", adminH.UpdateHero)

		// About
		r.Get("/about", adminH.GetAbout)
		r.Put("/about", adminH.UpdateAbout)

		// Skills
		r.Get("/skills", adminH.ListSkills)
		r.Post("/skills", adminH.CreateSkill)
		r.Put("/skills/{id}", adminH.UpdateSkill)
		r.Delete("/skills/{id}", adminH.DeleteSkill)

		// Skill Categories
		r.Get("/skill-categories", adminH.ListSkillCategories)
		r.Post("/skill-categories", adminH.CreateSkillCategory)
		r.Delete("/skill-categories/{id}", adminH.DeleteSkillCategory)

		// Social Links
		r.Get("/social-links", adminH.ListSocialLinks)
		r.Post("/social-links", adminH.CreateSocialLink)
		r.Put("/social-links/{id}", adminH.UpdateSocialLink)
		r.Delete("/social-links/{id}", adminH.DeleteSocialLink)

		// Navigation
		r.Get("/navigation", adminH.ListNavigation)
		r.Post("/navigation", adminH.CreateNavItem)
		r.Put("/navigation/{id}", adminH.UpdateNavItem)
		r.Delete("/navigation/{id}", adminH.DeleteNavItem)

		// Projects
		r.Get("/projects", adminH.ListProjects)
		r.Post("/projects", adminH.CreateProject)
		r.Get("/projects/{id}", adminH.GetProject)
		r.Put("/projects/{id}", adminH.UpdateProject)
		r.Delete("/projects/{id}", adminH.DeleteProject)

		// Experiences
		r.Get("/experiences", adminH.ListExperiences)
		r.Post("/experiences", adminH.CreateExperience)
		r.Put("/experiences/{id}", adminH.UpdateExperience)
		r.Delete("/experiences/{id}", adminH.DeleteExperience)

		// Blog
		r.Get("/blog", adminH.ListBlogPosts)
		r.Post("/blog", adminH.CreateBlogPost)
		r.Get("/blog/{id}", adminH.GetBlogPost)
		r.Put("/blog/{id}", adminH.UpdateBlogPost)
		r.Delete("/blog/{id}", adminH.DeleteBlogPost)

		// Contact Settings
		r.Get("/contact/settings", adminH.GetContactSettings)
		r.Put("/contact/settings", adminH.UpdateContactSettings)

		// Contact Submissions
		r.Get("/contact/submissions", adminH.ListSubmissions)
		r.Patch("/contact/submissions/{id}/read", adminH.MarkSubmissionRead)
		r.Patch("/contact/submissions/{id}/archive", adminH.ArchiveSubmission)
		r.Delete("/contact/submissions/{id}", adminH.DeleteSubmission)

		// Resume/CV
		r.Get("/resume", adminH.GetResumeSettings)
		r.Put("/resume", adminH.UpdateResumeSettings)
	})

	return r
}
