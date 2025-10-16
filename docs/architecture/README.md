# Architektur-Dokumentation

Dieser Ordner enthält wichtige Architektur-Dokumentation für das Projekt.

## Architektur-Entscheidungen (ADRs)

Wir dokumentieren wichtige Architektur-Entscheidungen als Architecture Decision Records (ADRs):

- [ADR-0001](decisions/0001-service-layer-entity-mapping.md): Service Layer Return Types - Entities vs DTOs

## Wichtige Prinzipien

### Backend
- **Layered Architecture**: Controller → Service → Repository
- **Entity-Handling**: Services arbeiten mit JPA-Entities, Mapping zu DTOs erfolgt in Controllern
- **Fetch Strategies**: Explizite Fetch-Joins für required relations
- **Validation**: Frühe Validierung in Controllern, Business-Regeln in Services

### Frontend
- **Feature-based Structure**: Code-Organisation nach Business-Features
- **MVP Pattern**: Klare Trennung von View, Presenter und Model
- **Server State**: React Query als single source of truth