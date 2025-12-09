# Machine Management App (Work in progress)
<img width="1916" height="935" alt="grafik" src="https://github.com/user-attachments/assets/0b4f4617-87ab-42e0-b74e-0e185c9ca60a" />
<img width="1915" height="940" alt="grafik" src="https://github.com/user-attachments/assets/ccf07f67-4db6-4e39-9a0e-91dc6fd5305c" />
<img width="1919" height="936" alt="grafik" src="https://github.com/user-attachments/assets/cdf2df35-34e4-482d-8e28-e5dab7b47545" />
<img width="1916" height="938" alt="grafik" src="https://github.com/user-attachments/assets/6a355204-7a56-48a3-a396-22ab516258b2" />


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
