# 💼 Personal Portfolio Platform (Monorepo)

A production-grade developer portfolio platform built with **React**, **TypeScript**, **Vite**, **Go (Golang)**, and **PostgreSQL**.

---

## 🏗️ Monorepo Architecture

```
portfolio/
├── apps/
│   ├── api/                  # Go REST API backend (Clean Architecture)
│   └── web/                  # React + TypeScript + Vite + Tailwind CSS frontend
├── docker-compose.yml        # Multi-service stack (PostgreSQL + Go API + Web)
└── package.json              # Monorepo task runner
```

---

## 🚀 Quick Start

### Run with Docker Compose
```bash
docker compose up -d --build
```
- **Web Frontend**: `http://localhost:8086`
- **Go REST API**: `http://localhost:8081`

### Run Locally
```bash
# Frontend
cd apps/web && bun install && bun run dev

# Backend API
cd apps/api && go run cmd/server/main.go
```

---

## 📄 License
MIT
