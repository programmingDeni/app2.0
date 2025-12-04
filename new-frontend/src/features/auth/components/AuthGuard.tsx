import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../query/useCurrentUser";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean; // true = muss eingeloggt sein, false = darf NICHT eingeloggt sein
};

export function AuthGuard({ children, requireAuth = true }: Props) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Wenn Auth erforderlich aber nicht eingeloggt → Login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wenn NICHT eingeloggt sein soll aber eingeloggt ist → Home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}