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

#### 2.1.1 AuditableEntity Abstract Class

- [x] Create AuditableEntity abstract class with:
  - [x] createdBy, createdAt, modifiedBy, modifiedAt fields
  - [x] @PrePersist method to set createdAt
  - [x] @PreUpdate method to set modifiedAt
  - [x] Lombok @Getter for all fields
  - [x] Setter for modifiedBy and modifiedAt
  - [ ] Add @EntityListeners(AuditingEntityListener.class) annotation

#### 2.1.1 AuditableEntity Abstract Class

- [x] Create AuditableEntity abstract class with:
  - [x] createdBy, createdAt, modifiedBy, modifiedAt fields
  - [x] @PrePersist method to set createdAt
  - [x] @PreUpdate method to set modifiedAt
  - [x] Lombok @Getter for all fields
  - [x] Setter for modifiedBy and modifiedAt
  - [x] Add @EntityListeners(AuditingEntityListener.class) annotation

#### 2.1.2 UserPrincipal - Custom Authentication Object

- [x] Create UserPrincipal class in security package
  - [x] Fields: Integer userId, String email
  - [x] Use Lombok @Data and @AllArgsConstructor
  - [x] This replaces simple String email in SecurityContext

#### 2.1.3 Update JwtAuthenticationFilter

- [x] Import UserPrincipal class
- [x] Change Authentication creation from String email to UserPrincipal:
  - [x] Create UserPrincipal(userId, email) object
  - [x] Pass UserPrincipal as principal (instead of email String)
  - [x] This makes userId available in SecurityContext

#### 2.1.4 AuditorAware Implementation

- [x] Create AuditorAwareImpl class in config package
  - [x] Implement AuditorAware<Integer> interface
  - [x] Override getCurrentAuditor() method:
    - [x] Get Authentication from SecurityContextHolder
    - [x] Check if authenticated
    - [x] Cast principal to UserPrincipal
    - [x] Return Optional.of(userPrincipal.getUserId())
    - [x] Return Optional.empty() if not authenticated

#### 2.1.5 Enable JPA Auditing

- [x] add to existing config class
  - [x] Add @Configuration annotation
  - [x] Add @EnableJpaAuditing annotation (This activates automatic auditing)

#### 2.1.6 Fix AuthController /me Endpoint

- [x] Update getCurrentUser() method:
  - [x] Cast authentication.getPrincipal() to UserPrincipal
  - [x] Get email from userPrincipal.getEmail() instead of authentication.getName()
  - [x] Handle case where principal might still be String (during transition)

### 2.2 Update Entities with User References

- [x] Add userId field to Machine, MachineAttribute, AttroibuteValue, MachineTZemplate, TempalteAttribtue entity (@ManyToOne User)
- [x] Extend all entities from AuditableEntity
- [x] MachineTemplate: decide if user-specific or shared (currently no userId needed)

### 2.3 Database Migration

- [x] Create Flyway/Liquibase migration: Add user table
- [x] Create migration: Add user_id column to machine table
- [x] Create migration: Add user_id column to machine_attribute table
- [x] Create migration: Add user_id column to attribute_value table
- [x] Create migration: Add audit columns (created_by, created_at, modified_by, modified_at)
- [x] Create migration: Add foreign key constraints
- [x] Test migration with existing data (assign to default admin user)

### 2.4 Update Services to Filter by User

#### 2.4.1 Create SecurityUtils Helper Class

- [x] Create `util/SecurityUtils.java` class
- [x] Add static method `getCurrentUserId()`:
  - [x] Get Authentication from SecurityContextHolder
  - [x] Check if authenticated
  - [x] Cast principal to UserPrincipal
  - [x] Return userId from UserPrincipal
  - [x] Throw UnauthorizedException if not authenticated

#### 2.4.2 Update Repositories with userId Filtering

- [x] Update `MachineRepository`:

  - [ ] Add `List<Machine> findByUserId(Integer userId)`
  - [ ] Add `Optional<Machine> findByIdAndUserId(Integer id, Integer userId)`
  - [ ] Update `findWithAllDataById` to `findWithAllDataByIdAndUserId` with userId parameter

- [x] Update `MachineAttributeRepository`:

  - [ ] Add `List<MachineAttribute> findByUserId(Integer userId)`
  - [ ] Add `Optional<MachineAttribute> findByIdAndUserId(Integer id, Integer userId)`
  - [ ] Update `findAllMachineAttributesByMachineId` to also check userId

- [x] Update `AttributeValueRepository`:

  - [ ] Add `List<AttributeValue> findByUserId(Integer userId)`
  - [ ] Add `Optional<AttributeValue> findByIdAndUserId(Integer id, Integer userId)`

- [x] Update `MachineTemplateRepository`:

  - [ ] Add `List<MachineTemplate> findByUserId(Integer userId)`
  - [ ] Add `Optional<MachineTemplate> findByIdAndUserId(Integer id, Integer userId)`
  - [ ] Update `findAllWithAttributeTemplates` to filter by userId

- [x] Update `TemplateAttributeRepository`:
  - [ ] Add `List<TemplateAttribute> findByUserId(Integer userId)`
  - [ ] Add `Optional<TemplateAttribute> findByIdAndUserId(Integer id, Integer userId)`

#### 2.4.3 Update GenericCrudService

- [x] Add three new abstract methods to GenericCrudService:

  - [x] `protected abstract List<E> findAllByUserId(Integer userId)`
  - [x] `protected abstract Optional<E> findByIdAndUserId(ID id, Integer userId)`
  - [x] `protected abstract void setUserId(E entity, Integer userId)`

- [x] Update `findAll()` method:

  - [x] Get userId from SecurityUtils.getCurrentUserId()
  - [x] Call findAllByUserId(userId) instead of repo.findAll()

- [x] Update `findById(ID id)` method:

  - [x] Get userId from SecurityUtils.getCurrentUserId()
  - [x] Call findByIdAndUserId(id, userId) instead of repo.findById(id)

- [x] Update `create(DTO dto)` method:

  - [x] Get userId from SecurityUtils.getCurrentUserId()
  - [x] After creating entity from DTO, call setUserId(entity, userId)
  - [x] Then save entity

- [x] Update `update(ID id, DTO dto)` method:

  - [x] Use new findById(id) which already checks userId ownership
  - [x] No additional changes needed (ownership check happens in findById)

- [x] Update `delete(ID id)` method:
  - [x] Use findById(id) first to verify ownership
  - [x] Then delete (instead of just checking existsById)

#### 2.4.4 Implement Abstract Methods in MachineService

- [x] Implement `findAllByUserId(Integer userId)`:

  - [x] Return `((MachineRepository) repo).findByUserId(userId)`

- [x] Implement `findByIdAndUserId(Integer id, Integer userId)`:

  - [x] Return `((MachineRepository) repo).findByIdAndUserId(id, userId)`

- [x] Implement `setUserId(Machine entity, Integer userId)`:

  - [x] Call `entity.setUserId(userId)`

- [x] Update overridden `findById(Integer id)` method:
  - [x] Get userId from SecurityUtils.getCurrentUserId()
  - [x] Use `findWithAllDataByIdAndUserId(id, userId)` instead

#### 2.4.5 Implement Abstract Methods in MachineTemplateService

- [ ] Convert MachineTemplateService to extend GenericCrudService

  - [ ] OR manually add userId filtering to all methods

- [ ] Update `getAllTemplatesLazy()`:

  - [ ] Get userId from SecurityUtils.getCurrentUserId()
  - [ ] Return `templateRepo.findByUserId(userId)`

- [ ] Update `getAllTemplatesWithAttributes()`:

  - [ ] Get userId and filter by userId

- [ ] Update `getTemplateById(Integer id)`:

  - [ ] Get userId and use `findByIdAndUserId(id, userId)`

- [ ] Update `createTemplate(MachineTemplateDto dto)`:

  - [ ] Get userId and set it: `template.setUserId(userId)`

- [ ] Update `deleteTemplate(Integer id)`:
  - [ ] First call getTemplateById(id) to verify ownership
  - [ ] Then proceed with delete

#### 2.4.6 Update MachineAttributeService

- [ ] Update `getAllAttributes()`:

  - [ ] Get userId from SecurityUtils.getCurrentUserId()
  - [ ] Return `attributeRepository.findByUserId(userId)`

- [ ] Update `getAttributeById(Integer id)`:

  - [ ] Get userId from SecurityUtils.getCurrentUserId()
  - [ ] Use `findByIdAndUserId(id, userId)`

- [ ] Update `createMachineAttribute(Integer machineId, CreateMachineAttributeDto dto)`:

  - [ ] Get userId from SecurityUtils.getCurrentUserId()
  - [ ] Verify machine ownership: `machineRepository.findByIdAndUserId(machineId, userId)`
  - [ ] Set userId on new attribute: `attr.setUserId(userId)`

- [ ] Update `updateAttribute(Integer id, MachineAttributeDto request)`:

  - [ ] Use getAttributeById(id) which already checks ownership

- [ ] Update `deleteAttribute(Integer id)`:

  - [ ] Use getAttributeById(id) first to verify ownership

- [ ] Update `getAttributesByMachineId(Integer machineId)`:
  - [ ] Get userId and verify machine ownership first
  - [ ] Then return attributes

#### 2.4.7 Update AttributeValueService

- [ ] Add userId filtering to all methods (similar pattern to MachineAttributeService)
- [ ] Verify attribute ownership before creating/updating values

#### 2.4.8 Update AttributeTemplateService

- [ ] Add userId filtering to all methods
- [ ] Verify template ownership before creating/updating template attributes

#### 2.4.9 Update Specialized Operation Services

- [ ] Update `MachineTemplateOperationsService`:

  - [ ] Verify machine ownership in assignTemplate()
  - [ ] Verify template ownership in assignTemplate()
  - [ ] Set userId when creating machine from template

- [ ] Update `MachineAttributeOperationsService`:
  - [ ] Verify machine ownership before adding/editing/removing attributes
  - [ ] Set userId when creating new attributes

### 2.5 Update Controllers

## erstmal übersprungen brauchen wir anscheinend nicht,

## services holen den user aus dem security kontext

- [ ] Add @AuthenticationPrincipal User parameter to controller methods
- [ ] Pass current user to service methods
- [ ] Update DTOs to include userId where needed (but not expose in responses) - bei welchen macht es Sinn?

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

**Architecture Decision: React Query Cache = Single Source of Truth (NO AuthContext!)**

---

### 4.1 Setup & Types

- [x] Create folder structure (already exists)
- [ ] **types/User.ts**
  - [ ] Export User interface: `{ id: number, email: string, firstName?: string, lastName?: string }`
- [ ] **types/LoginRequest.ts**
  - [ ] Export LoginRequest interface: `{ email: string, password: string }`
- [ ] **types/RegisterRequest.ts**
  - [ ] Export RegisterRequest interface: `{ email: string, password: string, firstName?: string, lastName?: string }`
- [ ] **types/AuthResponse.ts**
  - [ ] Export AuthResponse interface: `{ token: string, refreshToken: string, user: User }`

---

### 4.2 Auth Service (HTTP Layer)

File: `services/authService.ts`

- [ ] **login(email: string, password: string)**
  - [ ] POST to `/api/auth/login` with `{ email, password }`
  - [ ] Store `response.data.token` in localStorage
  - [ ] Return `AuthResponse`
- [ ] **register(data: RegisterRequest)**
  - [ ] POST to `/api/auth/register` with data
  - [ ] Store token in localStorage
  - [ ] Return `AuthResponse`
- [ ] **getCurrentUser()**
  - [ ] Check if token exists in localStorage, throw error if not
  - [ ] GET from `/api/auth/me` (token added by interceptor)
  - [ ] Return `User`
- [ ] **logout()**
  - [ ] Remove token from localStorage
  - [ ] Return void

---

### 4.3 React Query Hooks (State Management Layer)

File: `query/useCurrentUser.ts`

- [x] **useCurrentUser()**
  - [ ] Use `useQuery` with queryKey: `['currentUser']`
  - [ ] queryFn: `authService.getCurrentUser`
  - [ ] Options: `retry: false`, `staleTime: 5 * 60 * 1000`
  - [ ] Return: `{ data: user, isLoading, isError }`
  - [ ] Derived state: `isAuthenticated = !!user`

File: `query/useLogin.ts`

- [x] **useLogin()**
  - [ ] Use `useMutation` with mutationFn: `authService.login`
  - [ ] Get `queryClient` from `useQueryClient()`
  - [ ] Get `navigate` from `useNavigate()`
  - [ ] onSuccess:
    - [ ] `queryClient.setQueryData(['currentUser'], response.user)`
    - [ ] `navigate('/machines')`
  - [ ] Return mutation object

File: `query/useRegister.ts`

- [x] **useRegister()**
  - [ ] Use `useMutation` with mutationFn: `authService.register`
  - [ ] Get `queryClient` from `useQueryClient()`
  - [ ] Get `navigate` from `useNavigate()`
  - [ ] onSuccess:
    - [ ] `queryClient.setQueryData(['currentUser'], response.user)`
    - [ ] `navigate('/machines')`
  - [ ] Return mutation object

File: `query/useLogout.ts`

- [x] **useLogout()**
  - [ ] Use `useMutation` with mutationFn: `authService.logout`
  - [ ] Get `queryClient` from `useQueryClient()`
  - [ ] Get `navigate` from `useNavigate()`
  - [ ] onSuccess:
    - [ ] `queryClient.clear()` (clear all cached data)
    - [ ] `navigate('/login')`
  - [ ] Return mutation object

---

### 4.4 UI Components

File: `views/LoginView.tsx`

- [x] **LoginView Component**
  - [ ] Use `useLogin()` hook
  - [ ] Define `handleSubmit(email, password)` that calls `mutate({ email, password })`
  - [ ] Render `<LoginFormUI onSubmit={handleSubmit} isLoading={isPending} error={error} />`

File: `components-ui/LoginFormUI.tsx`

- [x] **LoginFormUI Component**
  - [ ] Props: `{ onSubmit: (email, password) => void, isLoading: boolean, error?: Error }`
  - [ ] Form with email and password inputs
  - [ ] Submit button (disabled when isLoading)
  - [ ] Display error message if error exists
  - [ ] Basic validation: email format, required fields

File: `views/RegisterView.tsx`

- [x] **RegisterView Component**
  - [ ] Use `useRegister()` hook
  - [ ] Define `handleSubmit(data: RegisterRequest)` that calls `mutate(data)`
  - [ ] Render `<RegisterFormUI onSubmit={handleSubmit} isLoading={isPending} error={error} />`

File: `components-ui/RegisterFormUI.tsx`

- [x] **RegisterFormUI Component**
  - [ ] Props: `{ onSubmit: (data: RegisterRequest) => void, isLoading: boolean, error?: Error }`
  - [ ] Form with email, password, firstName, lastName inputs
  - [ ] Submit button (disabled when isLoading)
  - [ ] Display error message if error exists
  - [ ] Validation: email format, password strength (min 8 chars)

---

## PHASE 5 - Frontend: API Integration & Routing

### 5.1 Axios Interceptors

- [ ] Create axios instance in services/axios.ts (baseURL from env)
- [ ] Add request interceptor to attach JWT token to headers
  - [ ] Read token from localStorage
  - [ ] Add Authorization: Bearer {token} header
- [ ] Add response interceptor to handle 401 errors
  - [ ] Remove token from localStorage on 401
  - [ ] Invalidate React Query cache (queryClient.invalidateQueries(['currentUser']))
  - [ ] Redirect to /login
- [ ] Optional: Implement token refresh logic (if backend supports it)
  - [ ] Intercept 401 with specific error code
  - [ ] Call /api/auth/refresh with refreshToken
  - [ ] Retry original request with new token

### 5.2 Routing & Protection

- [ ] Create ProtectedRoute component (checks authentication)
  - [ ] Use useCurrentUser() hook to check if user exists
  - [ ] Show loading spinner while checking authentication
  - [ ] Redirect to /login if not authenticated
  - [ ] Render children if authenticated
- [ ] Add routing in App.tsx:
  - [ ] /login (public)
  - [ ] /register (public)
  - [ ] /machines (protected with ProtectedRoute)
  - [ ] /templates (protected with ProtectedRoute)
- [ ] Redirect to /login if not authenticated (handled by ProtectedRoute)
- [ ] Redirect to /machines after successful login (handled in useLogin hook)
- [ ] Persist login state across page refreshes
  - [ ] Token in localStorage persists
  - [ ] useCurrentUser() automatically fetches user on mount if token exists

### 5.3 Update Existing Features

- [x] ~~Wrap App with AuthProvider~~ → SKIPPED: No AuthProvider needed!
- [ ] Backend already filters by userId, no frontend changes needed
- [ ] Update machine queries to work with user-filtered data (already filtered by backend)
- [ ] Update template queries (already filtered by backend)
- [ ] React Query cache cleared on logout (done in useLogout hook)
- [ ] Test that users only see their own data (backend responsibility)

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
