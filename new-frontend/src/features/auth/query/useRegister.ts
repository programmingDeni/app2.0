/**
 * React Query Hook: useRegister
 *
 * @description
 * Mutation hook for user registration.
 * Handles token storage, React Query cache update, and navigation.
 *
 * ## What it does
 * 1. Calls authService.register() (stores token in localStorage)
 * 2. Updates React Query cache with user data
 * 3. Navigates to /machines on success
 *
 * @example
 * function RegisterView() {
 *   const { mutate: register, isPending, error } = useRegister();
 *
 *   const handleSubmit = (data: RegisterRequest) => {
 *     register(data);
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
import { register } from "../services/authService";
import type { RegisterRequest } from "../types/RegisterRequest";

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),

    onSuccess: (response) => {
      // Update React Query cache with user data
      // Token is already stored by authService.register()
      queryClient.setQueryData(["currentUser"], response.user);

      // Navigate to main page
      navigate("/machines");
    },

    onError: (error) => {
      console.error("Registration failed:", error);
      // Error handling can be done in UI component via error property
    },
  });
}
