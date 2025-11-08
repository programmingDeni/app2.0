# Docker-Setup: Schritt-für-Schritt Anleitung

## Ziel

Bestehende Machine Management Anwendung (Spring Boot + React + PostgreSQL) vollständig containerisieren und portabel machen.

---

## Phase 1: Secrets externalisieren

### Warum?

Aktuell sind Credentials hardcoded in `application-secret.properties`. Das ist unsicher und nicht portabel. Mit `.env` kann jeder PC/Server eigene Credentials nutzen.

### 1.1 `.env` Datei im Root erstellen

**Speicherort:** `app2.0/.env`

.env

# Datenbank

POSTGRES_DB=machinesdb
POSTGRES_USER=admin
POSTGRES_PASSWORD=IhrSicheresPasswort123

# Backend JWT

JWT_SECRET=IhrJWTSecretMindestens256BitsLang
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

# Umgebung

SPRING_PROFILES_ACTIVE=prod
Wichtig: Diese Datei wird NICHT ins Git committed!

### 1.2 .env.example Template erstellen

Speicherort: app2.0/.env.example

# Datenbank

POSTGRES_DB=machinesdb
POSTGRES_USER=admin
POSTGRES_PASSWORD=changeme

# Backend JWT

JWT_SECRET=changeme-mindestens-256-bits
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

# Umgebung

SPRING_PROFILES_ACTIVE=prod
Wichtig: Diese Datei WIRD ins Git committed als Vorlage für andere Entwickler!
1.3 application-secret.properties auf Umgebungsvariablen umstellen
Datei: backend/machine-management/src/main/resources/application-secret.properties Ändern von:
spring.datasource.username=admin
spring.datasource.password=geheim123
jwt.secret=meinHardcodedSecret
Ändern zu:
spring.datasource.username=${POSTGRES_USER}
spring.datasource.password=${POSTGRES_PASSWORD}
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION_MS}
jwt.refresh-expiration=${JWT_REFRESH_EXPIRATION_MS}
Was passiert: Spring liest jetzt Werte aus Umgebungsvariablen (die Docker später setzt)
1.4 .gitignore prüfen/aktualisieren
Datei: app2.0/.gitignore Sicherstellen, dass vorhanden:
.env
\*.env
!.env.example
Was passiert: .env wird nie ins Git committed, .env.example schon
Phase 2: Backend containerisieren
Warum?
Aktuell müssen Sie Java 21 + Maven installiert haben. Mit Docker läuft das Backend überall ohne Installation.
2.1 Production Dockerfile erstellen
Neu erstellen: backend/machine-management/Dockerfile

# ===== STAGE 1: Build =====

# Nutzt großes Maven-Image zum Kompilieren

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# pom.xml zuerst kopieren (für Docker Layer Caching)

COPY pom.xml .
RUN mvn dependency:go-offline

# Source Code kopieren und bauen

COPY src ./src
RUN mvn clean package -DskipTests

# ===== STAGE 2: Runtime =====

# Nutzt kleines Runtime-Image (nur Java, kein Maven)

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root User erstellen (Sicherheit)

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Nur JAR aus Build-Stage kopieren

COPY --from=build /app/target/\*.jar app.jar

# Port freigeben

EXPOSE 8080

# Health Check (prüft ob Backend läuft)

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
 CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Application starten

ENTRYPOINT ["java", "-jar", "app.jar"]
Was ist Multi-stage Build?
Stage 1: Maven kompiliert Code (Image: ~500MB)
Stage 2: Nur JAR wird kopiert (finales Image: ~200MB)
Ergebnis: Kleineres, schnelleres Image
2.2 .dockerignore erstellen
Neu erstellen: backend/machine-management/.dockerignore
target/
.mvn/
_.iml
.idea/
.git/
.gitignore
README.md
_.log
Warum? Diese Dateien werden nicht ins Docker-Image kopiert → Build ist schneller
Phase 3: Frontend containerisieren
Warum?
Aktuell müssen Sie Node.js + pnpm installiert haben. Mit Docker läuft das Frontend überall ohne Installation.
3.1 Production Dockerfile erstellen
Neu erstellen: new-frontend/Dockerfile

# ===== STAGE 1: Build =====

# Node.js für Build-Prozess

FROM node:20-alpine AS build
WORKDIR /app

# pnpm installieren

RUN npm install -g pnpm

# Dependencies installieren (mit Lock-File für Reproduzierbarkeit)

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Source Code kopieren und bauen

COPY . .
RUN pnpm run build

# ===== STAGE 2: Runtime =====

# Nginx für statische Files

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Build-Output kopieren

COPY --from=build /app/dist .

# Nginx Config kopieren (für React Router)

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port freigeben

EXPOSE 80

# Health Check

HEALTHCHECK --interval=30s --timeout=3s \
 CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Nginx startet automatisch

Was passiert?
Stage 1: Vite baut Production-Bundle
Stage 2: Nginx serviert statische Files (HTML/JS/CSS)
Finales Image: Klein und schnell
3.2 Nginx Config erstellen
Neu erstellen: new-frontend/nginx.conf
server {
listen 80;
server_name localhost;
root /usr/share/nginx/html;
index index.html;

    # React Router Support: Alle Routen → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caching für statische Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

}
Warum nötig? React Router nutzt Client-Side-Routing. Ohne diese Config würde /machines einen 404-Fehler werfen.
3.3 .dockerignore erstellen
Neu erstellen: new-frontend/.dockerignore
node_modules/
dist/
.git/
.gitignore
_.log
.env
.env._
!.env.example
README.md
coverage/
.vscode/
Warum? Build ist schneller, Image ist kleiner
Phase 4: Docker Compose optimieren
Warum?
Sie haben bereits docker-compose.yml, aber:
Nicht alle Services nutzen Production Dockerfiles
Keine Health Checks
Keine Trennung Development/Production
4.1 docker-compose.yml aktualisieren (Production)
Datei: app2.0/docker-compose.yml Ersetzen mit:
version: '3.8'

services:

# PostgreSQL Datenbank

postgres:
image: postgres:16-alpine
container_name: app20-postgres
environment:
POSTGRES_DB: ${POSTGRES_DB}
POSTGRES_USER: ${POSTGRES_USER}
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
volumes: - postgres_data:/var/lib/postgresql/data
networks: - app-network
healthcheck:
test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
interval: 10s
timeout: 5s
retries: 5
restart: unless-stopped

# Spring Boot Backend

backend:
build:
context: ./backend/machine-management
dockerfile: Dockerfile
container_name: app20-backend
environment:
POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION_MS: ${JWT_EXPIRATION_MS}
      JWT_REFRESH_EXPIRATION_MS: ${JWT_REFRESH_EXPIRATION_MS}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
ports: - "8080:8080"
depends_on:
postgres:
condition: service_healthy
networks: - app-network
restart: unless-stopped

# React Frontend

frontend:
build:
context: ./new-frontend
dockerfile: Dockerfile
container_name: app20-frontend
ports: - "3000:80"
depends_on: - backend
networks: - app-network
restart: unless-stopped

volumes:
postgres_data:
driver: local

networks:
app-network:
driver: bridge
Was ist neu?
Health Checks: Backend wartet bis DB bereit ist
Umgebungsvariablen: Aus .env Datei
restart: unless-stopped (startet nach Reboot automatisch)
Production Dockerfiles werden genutzt
4.2 docker-compose.dev.yml erstellen (Development)
Neu erstellen: app2.0/docker-compose.dev.yml
version: '3.8'

services:
postgres:
image: postgres:16-alpine
container_name: app20-postgres-dev
environment:
POSTGRES_DB: ${POSTGRES_DB:-machinesdb}
POSTGRES_USER: ${POSTGRES_USER:-admin}
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-devpassword}
ports: - "5432:5432" # Exposed für DB-Tools (pgAdmin, DBeaver)
volumes: - postgres_data_dev:/var/lib/postgresql/data
networks: - app-network

backend:
build:
context: ./backend
dockerfile: Dockerfile.dev
container_name: app20-backend-dev
environment:
POSTGRES_USER: ${POSTGRES_USER:-admin}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-devpassword}
      POSTGRES_DB: ${POSTGRES_DB:-machinesdb}
      JWT_SECRET: ${JWT_SECRET:-dev-secret-change-in-production}
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB:-machinesdb}
ports: - "8080:8080" - "5005:5005" # Debug Port für IntelliJ/Eclipse
volumes: - ./backend/machine-management:/app # Live Code-Änderungen - maven_cache:/root/.m2
depends_on: - postgres
networks: - app-network

frontend:
build:
context: ./new-frontend
dockerfile: Dockerfile.dev
container_name: app20-frontend-dev
environment: - VITE_API_URL=http://localhost:8080
ports: - "3000:3000"
volumes: - ./new-frontend:/app # Live Code-Änderungen - /app/node_modules
depends_on: - backend
networks: - app-network

volumes:
postgres_data_dev:
maven_cache:

networks:
app-network:
driver: bridge
Unterschied zu Production:
Nutzt Dockerfile.dev (mit Hot-Reload)
Port 5432 exposed (für DB-Tools)
Debug Port 5005 (für IDE)
Volume Mounts: Code-Änderungen sofort sichtbar
4.3 Development Dockerfiles erstellen (falls noch nicht vorhanden)
Backend: backend/Dockerfile.dev (falls nicht vorhanden)
FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
EXPOSE 8080 5005
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]
Frontend: new-frontend/Dockerfile.dev (falls nicht vorhanden)
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
EXPOSE 3000
CMD ["sh", "-c", "pnpm install && pnpm run dev --host"]
Phase 5: Dokumentation
5.1 docs/deployment/01_dockerSetup.md befüllen
Datei: docs/deployment/01_dockerSetup.md

# Docker Setup - Machine Management Application

## Übersicht

Diese Anwendung läuft vollständig in Docker-Containern:

- **PostgreSQL 16:** Datenbank
- **Spring Boot Backend:** Java 21, Port 8080
- **React Frontend:** Vite + Nginx, Port 3000

## Voraussetzungen

- Docker Desktop installiert (Windows/Mac) oder Docker Engine (Linux)
- Docker Compose installiert
- Git

---

## Production Setup

### 1. Repository klonen

````bash
git clone <repository-url>
cd app2.0
2. Umgebungsvariablen konfigurieren
# Template kopieren
cp .env.example .env

# Mit Editor öffnen und anpassen
nano .env  # oder notepad .env (Windows)
WICHTIG: Ändern Sie mindestens:
POSTGRES_PASSWORD: Sicheres Passwort
JWT_SECRET: Mindestens 256 Bits (z.B. generiert mit openssl rand -base64 32)
3. Anwendung starten
docker-compose up -d
Was passiert:
PostgreSQL Container startet
Backend wartet auf DB, dann Flyway-Migrationen laufen
Frontend startet
4. Zugriff
Frontend: http://localhost:3000
Backend API: http://localhost:8080
Default Login: admin@example.com / admin123
5. Logs anschauen
# Alle Services
docker-compose logs -f

# Nur Backend
docker-compose logs -f backend
Development Setup (mit Hot-Reload)
Starten
docker-compose -f docker-compose.dev.yml up
Vorteile:
Code-Änderungen sofort sichtbar (kein Rebuild nötig)
Debug Port 5005 für IDE
PostgreSQL Port 5432 exposed für DB-Tools
IntelliJ/Eclipse Debugger verbinden
Remote JVM Debug Configuration erstellen
Host: localhost, Port: 5005
Breakpoints setzen und debuggen
Auf anderem PC entwickeln
Variante 1: Repo neu klonen
git clone <repository-url>
cd app2.0

# Eigene .env erstellen
cp .env.example .env
nano .env  # Eigene Werte eintragen

# Starten
docker-compose up
Ergebnis: Unabhängige Datenbank mit eigenen Credentials
Variante 2: Bestehende .env übertragen (unsicher!)
# .env vom ersten PC kopieren (z.B. via USB-Stick)
# NICHT ins Git committen!

docker-compose up
Befehle
# Production starten
docker-compose up -d

# Development starten
docker-compose -f docker-compose.dev.yml up

# Stoppen (Container bleiben)
docker-compose down

# Stoppen + Datenbank löschen
docker-compose down -v

# Neu builden nach Dockerfile-Änderungen
docker-compose build --no-cache
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# In Container einloggen
docker exec -it app20-backend sh
Deployment auf Server (z.B. DigitalOcean, Hetzner)
1. Server vorbereiten
# SSH verbinden
ssh user@your-server-ip

# Docker installieren (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose installieren
sudo apt-get update
sudo apt-get install docker-compose-plugin
2. Repository klonen
git clone <repository-url>
cd app2.0
3. Production .env erstellen
cp .env.example .env
nano .env

# WICHTIG: Sichere Credentials!
# - Langes Passwort
# - JWT_SECRET mit openssl rand -base64 32 generieren
4. Starten
docker-compose up -d
5. (Optional) Nginx Reverse Proxy für Domain/SSL
# Nginx installieren
sudo apt install nginx certbot python3-certbot-nginx

# Nginx Config erstellen
sudo nano /etc/nginx/sites-available/app2.0

# SSL-Zertifikat mit Let's Encrypt
sudo certbot --nginx -d yourdomain.com
Troubleshooting
Container startet nicht
# Logs checken
docker-compose logs backend

# Häufig: Port bereits belegt
# Lösung: Port in docker-compose.yml ändern
ports:
  - "8081:8080"  # Statt 8080:8080
Datenbank-Verbindung schlägt fehl
# Health Check prüfen
docker-compose ps

# PostgreSQL sollte "healthy" sein
# Falls nicht: Logs checken
docker-compose logs postgres
Flyway-Migrationen schlagen fehl
# Datenbank komplett zurücksetzen
docker-compose down -v
docker-compose up

# Oder: Manuell Migrationen prüfen
docker exec -it app20-postgres psql -U admin -d machinesdb
\dt  -- Tabellen anzeigen
Frontend zeigt 404 bei Routing
Problem: Nginx Config fehlt oder falsch Lösung:
new-frontend/nginx.conf prüfen (sollte try_files enthalten)
Neu builden: docker-compose build frontend
Neu starten: docker-compose up -d
Unterschiede: Development vs Production
Aspekt	Development	Production
Dockerfile	Dockerfile.dev	Dockerfile
Build	Keine Optimierung	Multi-stage, optimiert
Code-Änderungen	Hot-Reload	Rebuild nötig
Debug Port	5005 exposed	Nicht exposed
PostgreSQL Port	5432 exposed	Nur intern
Image-Größe	Größer	Kleiner
Startup	Langsamer	Schneller
Updates einspielen
Code-Änderungen
git pull
docker-compose up -d --build
Nur Config-Änderungen (.env)
nano .env  # Änderungen vornehmen
docker-compose up -d  # Services neu starten
Datenbank-Migrationen
Flyway läuft automatisch beim Backend-Start. Neue Migrations-Files (V*.sql) werden erkannt und ausgeführt.
Daten sichern
Datenbank Backup
# Backup erstellen
docker exec app20-postgres pg_dump -U admin machinesdb > backup.sql

# Backup wiederherstellen
docker exec -i app20-postgres psql -U admin machinesdb < backup.sql
Volumes sichern
# Liste Volumes
docker volume ls

# Volume sichern
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .

---

### 5.2 Root `README.md` aktualisieren

**Datei:** `app2.0/README.md`

**Ergänzen Sie eine Quick-Start Sektion (z.B. nach der Projektbeschreibung):**

```markdown
## Quick Start mit Docker

Die einfachste Art, die Anwendung zu starten:

```bash
# 1. Repository klonen
git clone <repository-url>
cd app2.0

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env bearbeiten: Passwords und JWT-Secret ändern!

# 3. Starten
docker-compose up -d

# 4. Im Browser öffnen
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Login: admin@example.com / admin123
Mehr Details: docs/deployment/01_dockerSetup.md
Voraussetzungen
Docker Desktop (Windows/Mac) oder Docker Engine (Linux)
Docker Compose

---

## Phase 6: Testen

### 6.1 Production Build testen

```bash
# Alles stoppen und löschen
docker-compose down -v

# Komplett neu bauen (ohne Cache)
docker-compose build --no-cache

# Starten
docker-compose up
Erwartetes Verhalten:
PostgreSQL startet zuerst
Backend wartet auf PostgreSQL Health Check
Flyway-Migrationen laufen (siehe Logs)
Backend startet (Port 8080)
Frontend startet (Port 3000)
6.2 Health Checks prüfen
# Container Status
docker-compose ps

# Sollte zeigen:
# postgres   healthy
# backend    running
# frontend   running
# Backend Health Check (falls Spring Actuator aktiviert)
curl http://localhost:8080/actuator/health
# Erwartet: {"status":"UP"}

# Frontend
curl http://localhost:3000
# Erwartet: HTML-Inhalt
6.3 API-Funktionalität testen
# Login testen
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Erwartet: JWT Token im Response
6.4 Frontend-Routing testen
Browser öffnen: http://localhost:3000
Navigation zu verschiedenen Routen testen (z.B. /machines, /templates)
Seite neu laden (F5) bei Route → sollte NICHT 404 geben
Falls 404: nginx.conf fehlt oder falsch konfiguriert
6.5 Datenbank-Migrationen verifizieren
# Backend Logs durchsuchen
docker-compose logs backend | grep -i flyway

# Erwartet:
# Flyway: Migrating schema to version 1
# Flyway: Migrating schema to version 2
# ...
# Flyway: Successfully applied 6 migrations
Oder direkt in DB prüfen:
# In PostgreSQL Container einloggen
docker exec -it app20-postgres psql -U admin -d machinesdb

# Flyway-Tabelle anzeigen
SELECT * FROM flyway_schema_history;

# Sollte Versionen V1 bis V6 zeigen
6.6 Development Setup testen
# Production stoppen
docker-compose down

# Development starten
docker-compose -f docker-compose.dev.yml up
Hot-Reload testen: Backend:
Öffnen Sie z.B. MachineController.java
Ändern Sie eine Response-Message
Speichern → Maven recompiled automatisch
API-Call wiederholen → neue Message erscheint
Frontend:
Öffnen Sie z.B. App.tsx
Ändern Sie einen Text
Speichern → Browser reloaded automatisch
6.7 Anderer PC simulieren (wichtig!)
# Alles löschen (simuliert "leeren PC")
docker-compose down -v
rm .env

# Als "neuer Entwickler": .env neu erstellen
cp .env.example .env

# ANDERE Werte eintragen als vorher!
nano .env
# z.B. POSTGRES_PASSWORD=neuesPasswort
#      JWT_SECRET=neuerSecret

# Starten
docker-compose up

# Sollte funktionieren mit neuen Credentials!
Erwartet:
Neue PostgreSQL-Datenbank (leer)
Flyway-Migrationen laufen wieder ab
Default admin-User wird angelegt
Unabhängig vom ersten Setup
Zusammenfassung: Ergebnis nach allen Phasen
✅ Dateien erstellt/geändert
Neu erstellt:
app2.0/.env (nicht in Git)
app2.0/.env.example (in Git)
backend/machine-management/Dockerfile
backend/machine-management/.dockerignore
new-frontend/Dockerfile
new-frontend/Dockerfile.dev (falls nicht vorhanden)
new-frontend/nginx.conf
new-frontend/.dockerignore
docker-compose.dev.yml
docs/deployment/01_dockerSetup.md
Geändert:
backend/machine-management/src/main/resources/application-secret.properties
docker-compose.yml
README.md
.gitignore
✅ Was Sie jetzt haben
Portabilität:
# Auf JEDEM Computer (Windows/Mac/Linux):
git clone <repo>
cd app2.0
cp .env.example .env
docker-compose up
# → Läuft!
Flexibilität:
Jeder PC kann eigene DB-Credentials nutzen (via .env)
Development mit Hot-Reload: docker-compose -f docker-compose.dev.yml up
Production optimiert: Multi-stage builds, kleine Images
Deployment:
# Auf Server:
ssh user@server
git clone <repo>
cd app2.0
cp .env.example .env
nano .env  # Production Credentials
docker-compose up -d
# → Läuft produktiv!
✅ Befehle die Sie kennen sollten
# Production starten
docker-compose up -d

# Development starten (Hot-Reload)
docker-compose -f docker-compose.dev.yml up

# Stoppen
docker-compose down

# Datenbank zurücksetzen
docker-compose down -v

# Neu builden
docker-compose build --no-cache

# Logs anschauen
docker-compose logs -f backend
Nächste Schritte (optional, nach erfolgreichem Setup)
CI/CD Pipeline: GitHub Actions für automatisches Deployment
Monitoring: Prometheus + Grafana für Metriken
Backups: Automatische Datenbank-Backups
Skalierung: Kubernetes für Multi-Node Deployment
Secrets Management: HashiCorp Vault statt .env
````
