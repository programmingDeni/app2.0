/**
 * Authentication Service
 *
 * @module features/auth/services/authService
 *
 * @description
 * HTTP Layer für Authentication - Kommuniziert mit dem Backend Auth API.
 * Verwaltet JWT Token Speicherung in localStorage.
 *
 * ## Architektur
 * - **Keine State Management**: Dieser Service speichert keinen State
 * - **Token Persistence**: JWT Tokens werden in localStorage gespeichert
 * - **Axios Integration**: Nutzt axios Instanz mit Interceptors
 * - **React Query Ready**: Designed für Verwendung mit React Query Hooks
 *
 * ## Token Management
 * - Access Token wird automatisch bei login/register gespeichert
 * - Token wird automatisch von axios Interceptor zu Requests hinzugefügt
 * - Bei 401 Response wird Token automatisch gelöscht und User ausgeloggt
 *
 * ## Usage mit React Query
 * ```typescript
 * // In Query Hook verwenden:
 * const { mutate } = useMutation({
 *   mutationFn: authService.login,
 *   onSuccess: (response) => {
 *     // Token ist bereits in localStorage
 *     // response.user enthält User-Daten
 *   }
 * });
 * ```
 *
 * ## Backend Endpoints
 * - POST /api/auth/login - Login mit Email/Password
 * - POST /api/auth/register - Neuen User registrieren
 * - GET /api/auth/me - Aktuellen User abrufen (benötigt Token)
 * - POST /api/auth/refresh - Access Token erneuern
 *
 * ## Related Files
 * - `features/auth/query/useLogin.ts` - React Query Hook für Login
 * - `features/auth/query/useCurrentUser.ts` - React Query Hook für User State
 * - `features/auth/query/useLogout.ts` - React Query Hook für Logout
 * - `services/axios.ts` - Axios Interceptor Configuration (Token Management)
 *
 * @example
 * // Direct usage (nicht empfohlen, nutze React Query Hooks):
 * const response = await authService.login('user@example.com', 'password');
 * console.log(response.user);
 *
 * @example
 * // Mit React Query (empfohlen):
 * import { useLogin } from '../query/useLogin';
 *
 * function LoginComponent() {
 *   const { mutate: login } = useLogin();
 *   login({ email: 'user@example.com', password: 'password' });
 * }
 */

import axios from "@/services/axios";
import type { AuthResponse } from "../types/AuthResponse";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import type { User } from "../types/User";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Login user with email and password
 * Stores token in localStorage and returns AuthResponse
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const loginData: LoginRequest = { email, password };

  const response = await axios.post<AuthResponse>("/api/auth/login", loginData);

  // Store tokens in localStorage
  localStorage.setItem(TOKEN_KEY, response.data.accessToken);
  if (response.data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  return response.data;
}

/**
 * Register new user
 * Stores token in localStorage and returns AuthResponse
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>("/api/auth/register", data);

  // Store tokens in localStorage
  localStorage.setItem(TOKEN_KEY, response.data.accessToken);
  if (response.data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  return response.data;
}

/**
 * Get current authenticated user
 * Throws error if no token exists
 */
export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Not authenticated - no token found");
  }

  const response = await axios.get<User>("/api/auth/me");
  return response.data;
}

/**
 * Refresh access token using refresh token
 * Updates token in localStorage
 */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>("/api/auth/refresh", {
    refreshToken,
  });

  // Update token in localStorage
  localStorage.setItem(TOKEN_KEY, response.data.accessToken);
  if (response.data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  return response.data;
}

/**
 * Logout user
 * Removes tokens from localStorage
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
