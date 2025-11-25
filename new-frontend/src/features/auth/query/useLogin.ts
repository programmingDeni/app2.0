/**
 * React Query Hook: useLogin
 *
 * @description
 * Mutation hook for user login.
 * Handles token storage, React Query cache update, and navigation.
 *
 * ## What it does
 * 1. Calls authService.login() (stores token in localStorage)
 * 2. Updates React Query cache with user data
 * 3. Navigates to /machines on success
 *
 * @example
 * function LoginView() {
 *   const { mutate: login, isPending, error } = useLogin();
 *
 *   const handleSubmit = (email: string, password: string) => {
 *     login({ email, password });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {isPending && <Spinner />}
 *       {error && <ErrorMessage error={error} />}
 *     </form>
 *   );
 * }
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // authService from "../services/authService";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),

    onSuccess: () => {
      // Update React Query cache with user data
      // Token is already stored by authService.login()
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // Navigate to main page
      navigate("/home");
    },

    onError: (error) => {
      console.error("Login failed:", error);
      // Error handling can be done in UI component via error property
    },
  });
}
