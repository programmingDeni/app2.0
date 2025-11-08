# Machine Management App (Work in progress)

This application enables the structured management and documentation of machines and their attributes, with a focus on maintenance and inspection tracking.

## Quick Start mit Docker

```bash
# Repository klonen
git clone <repository-url>
cd app2.0

# Umgebungsvariablen einrichten
cp .env.example .env
# .env bearbeiten: POSTGRES_USER, POSTGRES_PASSWORD und JWT_SECRET anpassen

# Starten
docker-compose up
```

# Zugriff

# Frontend: http://localhost:5173

# Backend: http://localhost:8080

# Login: admin@example.com / admin123

## 📖 Documentation

- [Architecture Documentation](docs/architecture/README.md)
  - [Architecture Decisions](docs/architecture/decisions/)

## ✨ Key Features

- JWT-based Authentication & Authorization
- Machine Management with Templates
- Audit Trail (created/modified tracking)
- Maintain machine history and status in a structured, scalable way

## 🛠️ Backend

The backend is a layered Spring Boot application that handles all core business logic related to machine and template management.

**Structure:**

- `Config` – Application configuration
- `Controller` – Exposes RESTful endpoints, entities converted to json by mappers here
  - `MachineController`: Manage machines and their attributes
  - `TemplateController`: Manage machine templates and attribute templates
- `DTO` – Data transfer objects
- `Exception` – Custom exceptions
- `Mapper` – DTO ↔ Entity mapping
- `Model` – Domain entities
- `Repository` – Data access (JPA)
- `Security` - JWT Authentication
- `Service` – Business logic, works with entities
- `Util`

## 🖥️ Frontend

The frontend is organized by **features** (e.g. machines and templates), and components follow the **Model-View-Presenter (MVP)** pattern.

React Query handles all data fetching and caching.
No local state is stored in components – the UI updates reactively based on server state.

## 📦 Tech Stack

- **Backend**: Java, Spring Boot, PostgreSQL
- **Frontend**: Typescript, Vite
- **Architecture**: Layered backend, feature-based frontend

```

```
