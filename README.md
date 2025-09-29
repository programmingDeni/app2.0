# Machine Management App

This application enables the structured management and documentation of machines and their attributes, with a focus on maintenance and inspection tracking.

## ✨ Key Features

- Manage machines and associated attributes
- Track last maintenance and inspection dates
- Initialize machines from reusable templates (e.g., multiple hoists with predefined attributes)
- Maintain machine history and status in a structured, scalable way

## 🛠️ Backend

The backend is a layered Spring Boot application that handles all core business logic related to machine and template management.

**Structure:**
- `Controller` – Exposes RESTful endpoints
  - `MachineController`: Manage machines and their attributes
  - `TemplateController`: Manage machine templates and attribute templates
- `Service` – Business logic
- `Repository` – Data access (JPA)
- `Model` – Domain entities
- `DTO` – Data transfer objects
- `Mapper` – DTO ↔ Entity mapping
- `DB` – PostgreSQL schema

## 🖥️ Frontend

The frontend is organized by **features** (e.g. machines and templates), and components follow the **Model-View-Presenter (MVP)** pattern.

React Query handles all data fetching and caching.  
No local state is stored in components – the UI updates reactively based on server state.

## 📦 Tech Stack

- **Backend**: Java, Spring Boot, PostgreSQL
- **Frontend**: Typescript, Vite
- **Architecture**: Layered backend, feature-based frontend
