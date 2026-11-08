package handler

import (
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/alexdev/portfolio/pkg/email"
)

// PublicHandler handles all unauthenticated public API endpoints.
type PublicHandler struct {
	db     *pgxpool.Pool
	mailer *email.Mailer
}

func NewPublicHandler(db *pgxpool.Pool, mailer *email.Mailer) *PublicHandler {
	return &PublicHandler{db: db, mailer: mailer}
}

// AdminHandler handles all authenticated admin API endpoints.
type AdminHandler struct {
	db *pgxpool.Pool
}

func NewAdminHandler(db *pgxpool.Pool) *AdminHandler {
	return &AdminHandler{db: db}
}

// toStringSlice safely converts []interface{} to []string.
func toStringSlice(v interface{}) []string {
	if v == nil {
		return []string{}
	}
	arr, ok := v.([]interface{})
	if !ok {
		return []string{}
	}
	result := make([]string, 0, len(arr))
	for _, item := range arr {
		if s, ok := item.(string); ok {
			result = append(result, s)
		}
	}
	return result
}
