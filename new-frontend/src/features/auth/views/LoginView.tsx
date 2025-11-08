import { useLogin } from "../query/useLogin";
import { LoginFormUI } from "../components-ui/LoginFormUI";
import { LoginRequest } from "../types/LoginRequest";

/**
 * LoginView - MVP Pattern
 *
 * Responsibilities:
 * - Business Logic (useLogin hook)
 * - Event Handlers (handleSubmit)
 * - Delegates presentation to LoginFormUI
 */
export const LoginView = () => {
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (loginRequest: LoginRequest) => {
    login(loginRequest);
  };

  return (
    <LoginFormUI onSubmit={handleSubmit} isLoading={isPending} error={error} />
  );
};
