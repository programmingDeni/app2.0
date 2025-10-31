möchte jetzt die benutzung durch mehrere personen ermöglichen.
.

neue entität erstellen: user
modelle erweitern um userId

# Entscheidung: Multi-User Architektur

## Gewählter Ansatz: User-ID in Modellen (Shared Database, Shared Schema)

### Begründung:

- **Einfachste Implementierung** für den Start
- **Kosteneffizient**: Eine Datenbank, ein Schema
- **Ausreichend für < 1000 User**
- **Schnelle Time-to-Market**
- später Migration zu komplexeren Architekturen möglich

# MACHINE MANAGEMENT APPLICATION - ENTITY STRUCTURE ANALYSIS

## PHASE 1 - Backend: Core Authentication (Foundation)

### 1.1 User Entity & Repository

- [ ] Create User entity (id, email, password, firstName, lastName, createdAt, updatedAt)
- [ ] Add unique constraint on email field
- [ ] Create UserRepository interface (extends JpaRepository)
- [ ] Add findByEmail() method to UserRepository

### 1.2 Security Dependencies

- [ ] Add spring-boot-starter-security to pom.xml
- [ ] Add jjwt-api, jjwt-impl, jjwt-jackson dependencies (for JWT)
- [ ] Add BCrypt password encoder bean

### 1.3 JWT Implementation

- [ ] Create JwtUtils class (generateToken, validateToken, getUsernameFromToken)
- [ ] Create JwtAuthenticationFilter (validates tokens on each request)
- [ ] Add JWT secret to application-secret.properties and expiration to application.properties
- [ ] Implement token refresh logic

### 1.4 Auth Services & Controllers

- [ ] Create UserService (register, findByEmail, loadUserByUsername)
- [ ] Create AuthService (login, register, refresh)
- [ ] Create AuthController with endpoints:
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/refresh
  - [ ] GET /api/auth/me
- [ ] Create AuthRequest/AuthResponse DTOs

### 1.5 Security Configuration

- [ ] Create SecurityConfig class
- [ ] Configure SecurityFilterChain (permit auth endpoints, secure others)
- [ ] Add JwtAuthenticationFilter to filter chain
- [ ] Configure CORS for frontend origins
- [ ] Disable CSRF (for stateless JWT)

---

## PHASE 2 - Backend: Add User Context to Data

### 2.1 Create Base Audit Entity

- [ ] Create AuditableEntity abstract class with:
  - [ ] createdBy, createdAt, modifiedBy, modifiedAt fields
  - [ ] @PrePersist method to set createdBy/createdAt
  - [ ] @PreUpdate method to set modifiedBy/modifiedAt
- [ ] Create AuditorAware implementation to get current user from SecurityContext

### 2.2 Update Entities with User References

- [ ] Add userId field to Machine entity (@ManyToOne User)
- [ ] Add userId field to MachineAttribute entity
- [ ] Add userId field to AttributeValue entity
- [ ] Extend all entities from AuditableEntity
- [ ] MachineTemplate: decide if user-specific or shared (currently no userId needed)

### 2.3 Database Migration

- [ ] Create Flyway/Liquibase migration: Add user table
- [ ] Create migration: Add user_id column to machine table
- [ ] Create migration: Add user_id column to machine_attribute table
- [ ] Create migration: Add user_id column to attribute_value table
- [ ] Create migration: Add audit columns (created_by, created_at, modified_by, modified_at)
- [ ] Create migration: Add foreign key constraints
- [ ] Test migration with existing data (assign to default admin user)

### 2.4 Update Services to Filter by User

- [ ] Update MachineService: Add userId filtering to all queries
- [ ] Update MachineAttributeService: Add userId filtering
- [ ] Update AttributeValueService: Add userId filtering
- [ ] Add getCurrentUserId() helper method in services
- [ ] Update repository methods: Add WHERE userId = ? to custom queries

### 2.5 Update Controllers

- [ ] Add @AuthenticationPrincipal User parameter to controller methods
- [ ] Pass current user to service methods
- [ ] Update DTOs to include userId where needed (but not expose in responses)

---

## PHASE 3 - Backend: Enforce Authorization

### 3.1 Authorization Checks

- [ ] Add ownership validation in service methods (verifyOwnership)
- [ ] Throw UnauthorizedException if user tries to access others' data
- [ ] Add authorization checks before update/delete operations
- [ ] Test authorization with multiple users

### 3.2 Custom Exceptions

- [ ] Create UnauthorizedException class (extends RuntimeException)
- [ ] Create ForbiddenException class
- [ ] Create GlobalExceptionHandler (@ControllerAdvice)
- [ ] Map exceptions to appropriate HTTP status codes (401, 403)

### 3.3 Testing & Documentation

- [ ] Write integration tests for authentication endpoints
- [ ] Write tests for authorization (user A cannot access user B's data)
- [ ] Update API documentation with authentication requirements
- [ ] Add example Authorization header to OpenAPI/Swagger spec

---

## PHASE 4 - Frontend: Authentication Features

### 4.1 Auth Feature Structure

- [ ] Create features/auth folder structure:
  - [ ] features/auth/types (User, LoginRequest, RegisterRequest, AuthResponse)
  - [ ] features/auth/services (authService.ts)
  - [ ] features/auth/query (useLogin, useRegister, useCurrentUser hooks)
  - [ ] features/auth/views (LoginView, RegisterView)
  - [ ] features/auth/components-ui (LoginFormUI, RegisterFormUI)

### 4.2 Auth Types & Services

- [ ] Create User type (id, email, firstName, lastName)
- [ ] Create LoginRequest type (email, password)
- [ ] Create RegisterRequest type (email, password, firstName, lastName)
- [ ] Create AuthResponse type (token, refreshToken, user)
- [ ] Create authService.ts with methods:
  - [ ] login(email, password)
  - [ ] register(userData)
  - [ ] refresh(refreshToken)
  - [ ] getCurrentUser()

### 4.3 Auth State Management

- [ ] Create AuthContext (React Context for user state)
- [ ] Create AuthProvider component
- [ ] Add user, token, isAuthenticated state
- [ ] Add login(), logout(), setUser() methods
- [ ] Store token in localStorage/sessionStorage
- [ ] Load user from token on app start

### 4.4 React Query Hooks

- [ ] Create useLogin hook (useMutation)
- [ ] Create useRegister hook (useMutation)
- [ ] Create useCurrentUser hook (useQuery)
- [ ] Create useLogout hook
- [ ] Add onSuccess callbacks to update AuthContext
- [ ] Add onError callbacks for error handling

### 4.5 Login & Register UI

- [ ] Create LoginView component (MVP pattern)
- [ ] Create LoginFormUI component (form with email/password)
- [ ] Create RegisterView component
- [ ] Create RegisterFormUI component
- [ ] Add form validation (email format, password strength)
- [ ] Add loading states during submission
- [ ] Add error message display

---

## PHASE 5 - Frontend: API Integration & Routing

### 5.1 Axios Interceptors

- [ ] Create axios instance in services/api.ts
- [ ] Add request interceptor to attach JWT token to headers
- [ ] Add response interceptor to handle 401 errors
- [ ] Implement token refresh logic in interceptor
- [ ] Redirect to login on 401 if refresh fails

### 5.2 Routing & Protection

- [ ] Create ProtectedRoute component (checks authentication)
- [ ] Add routing in App.tsx:
  - [ ] /login (public)
  - [ ] /register (public)
  - [ ] /machines (protected)
  - [ ] /templates (protected)
- [ ] Redirect to /login if not authenticated
- [ ] Redirect to /machines after successful login
- [ ] Persist login state across page refreshes

### 5.3 Update Existing Features

- [ ] Wrap App with AuthProvider
- [ ] Update machine queries to work with user-filtered data
- [ ] Update template queries (if user-specific)
- [ ] Invalidate React Query cache on logout
- [ ] Test that users only see their own data

---

## PHASE 6 - Frontend: User Experience & Polish

### 6.1 User Interface Components

- [ ] Create UserMenu component (dropdown with profile/logout)
- [ ] Create Header component with user info
- [ ] Add logout button functionality
- [ ] Show current user name in header
- [ ] Add user profile icon/avatar

### 6.2 Error Handling & Feedback

- [ ] Add toast notifications for login success/failure
- [ ] Add error messages for invalid credentials
- [ ] Add error messages for registration validation
- [ ] Add loading spinners during auth operations
- [ ] Add session timeout warning (optional)

### 6.3 Testing & Refinement

- [ ] Test full authentication flow (register → login → logout)
- [ ] Test token refresh mechanism
- [ ] Test protected routes redirect properly
- [ ] Test multiple users see different data
- [ ] Fix any bugs found during testing

---

## PHASE 7 - Optional: Advanced Features (Later)

### 7.1 Multi-Tenancy

- [ ] Add Organization/Team entity
- [ ] Add organizationId to entities
- [ ] Implement team member invitations
- [ ] Add role-based access control (RBAC)

### 7.2 Enhanced Security

- [ ] Add password reset flow (email-based)
- [ ] Add email verification on registration
- [ ] Add two-factor authentication (2FA)
- [ ] Add rate limiting on auth endpoints
- [ ] Add audit logging for sensitive operations

### 7.3 User Management

- [ ] Add user profile editing
- [ ] Add password change functionality
- [ ] Add user preferences/settings
- [ ] Add session management (view/revoke active sessions)
