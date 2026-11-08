package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/alexdev/portfolio/config"
	"github.com/alexdev/portfolio/database"
	"github.com/alexdev/portfolio/routes"
)

func main() {
	// Load configuration
	if err := config.Load(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Setup routes
	handler := routes.Setup(database.DB)

	addr := fmt.Sprintf("%s:%s", config.Cfg.ServerHost, config.Cfg.ServerPort)
	log.Printf("✓ Portfolio API server starting on http://%s", addr)
	log.Printf("  Environment: %s", config.Cfg.AppEnv)
	log.Printf("  Frontend URL: %s", config.Cfg.FrontendURL)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
