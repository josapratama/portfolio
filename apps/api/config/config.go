package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	ServerPort string
	ServerHost string

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT
	JWTAccessSecret  string
	JWTRefreshSecret string
	JWTAccessExpMin  int
	JWTRefreshExpDay int

	// Email / SMTP
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string
	SMTPFromName string

	// App
	AppEnv     string
	FrontendURL string

	// AuthHub SSO
	AuthHubURL          string
	AuthHubClientID     string
	AuthHubClientSecret string
}

var Cfg *Config

func Load() error {
	// Load .env if present (ignore error in production)
	_ = godotenv.Load()

	jwtAccessExpMin, _ := strconv.Atoi(getEnv("JWT_ACCESS_EXP_MIN", "15"))
	jwtRefreshExpDay, _ := strconv.Atoi(getEnv("JWT_REFRESH_EXP_DAY", "30"))
	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))

	Cfg = &Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		ServerHost: getEnv("SERVER_HOST", "0.0.0.0"),

		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "portfolio_db"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),

		JWTAccessSecret:  getEnv("JWT_ACCESS_SECRET", "change-me-access-secret-at-least-32-chars"),
		JWTRefreshSecret: getEnv("JWT_REFRESH_SECRET", "change-me-refresh-secret-at-least-32-chars"),
		JWTAccessExpMin:  jwtAccessExpMin,
		JWTRefreshExpDay: jwtRefreshExpDay,

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     smtpPort,
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", ""),
		SMTPFromName: getEnv("SMTP_FROM_NAME", "Portfolio Contact"),

		AppEnv:      getEnv("APP_ENV", "development"),
		FrontendURL: strings.TrimRight(getEnv("FRONTEND_URL", "http://localhost:5173"), "/"),

		AuthHubURL:          strings.TrimRight(getEnv("AUTHHUB_URL", "https://auth.josapratama.com"), "/"),
		AuthHubClientID:     getEnv("AUTHHUB_CLIENT_ID", "ah_client_portfolio_8d9e0f"),
		AuthHubClientSecret: getEnv("AUTHHUB_CLIENT_SECRET", "ah_secret_portfolio_3e4f5a6b7c8d9e0f1a2b3c"),
	}

	return nil
}

func (c *Config) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode,
	)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
