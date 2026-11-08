package handler

import (
	"net/http"

	"github.com/alexdev/portfolio/pkg/response"
)

// GetDashboard returns aggregate stats and recent contact submissions.
func (h *AdminHandler) GetDashboard(w http.ResponseWriter, r *http.Request) {
	var projectCount, blogCount, skillCount, submissionCount, unreadCount int
	h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM projects WHERE status = 'published'`).Scan(&projectCount)
	h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM blog_posts WHERE status = 'published'`).Scan(&blogCount)
	h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM skills WHERE is_visible = true`).Scan(&skillCount)
	h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM contact_submissions WHERE is_archived = false`).Scan(&submissionCount)
	h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM contact_submissions WHERE is_read = false AND is_archived = false`).Scan(&unreadCount)

	subRows, err := h.db.Query(r.Context(),
		`SELECT id, name, email, subject, is_read, created_at
		 FROM contact_submissions WHERE is_archived = false ORDER BY created_at DESC LIMIT 5`)
	if err != nil {
		response.InternalServerError(w)
		return
	}
	defer subRows.Close()

	type RecentSub struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		Subject   string `json:"subject"`
		IsRead    bool   `json:"is_read"`
		CreatedAt string `json:"created_at"`
	}
	recentSubs := []RecentSub{}
	for subRows.Next() {
		var s RecentSub
		subRows.Scan(&s.ID, &s.Name, &s.Email, &s.Subject, &s.IsRead, &s.CreatedAt)
		recentSubs = append(recentSubs, s)
	}

	response.Success(w, map[string]interface{}{
		"stats": map[string]int{
			"projects": projectCount, "blog_posts": blogCount,
			"skills": skillCount, "submissions": submissionCount,
			"unread_submissions": unreadCount,
		},
		"recent_submissions": recentSubs,
	})
}
