/**
 * React Query Hook: useCurrentUser
 *
 * @description
 * Fetches and caches the currently authenticated user.
 * This hook replaces traditional AuthContext - React Query cache is the single source of truth.
 *
 * ## Features
 * - Automatic caching (5 minutes staleTime)
 * - No retry on 401 (prevents infinite loops)
 * - Returns isAuthenticated derived state
 * - Automatically refetches on window focus
 *
 * @example
 * function Header() {
 *   const { data: user, isLoading, isAuthenticated } = useCurrentUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isAuthenticated) return <Navigate to="/login" />;
 *
 *   return <div>Welcome {user.email}</div>;
 * }
 */

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authService";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false, // Don't retry on 401 (not authenticated)
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache cleanup time
  });

  return {
    ...query,
    user: query.data,
    isAuthenticated: !!query.data && !query.isError,
  };
}
