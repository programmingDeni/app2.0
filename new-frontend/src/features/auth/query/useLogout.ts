/**
 * React Query Hook: useLogout
 *
 * @description
 * Mutation hook for user logout.
 * Clears tokens, React Query cache, and navigates to login.
 *
 * ## What it does
 * 1. Calls authService.logout() (removes tokens from localStorage)
 * 2. Clears entire React Query cache
 * 3. Navigates to /login
 *
 * @example
 * function UserMenu() {
 *   const { mutate: logout, isPending } = useLogout();
 *
 *   return (
 *     <button onClick={() => logout()} disabled={isPending}>
 *       {isPending ? 'Logging out...' : 'Logout'}
 *     </button>
 *   );
 * }
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      logout();
      return Promise.resolve();
    },

    onSuccess: () => {
      // Clear all React Query cache (machines, templates, etc.)
      queryClient.clear();

      // Navigate to login page
      navigate("/login");
    },

    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}
