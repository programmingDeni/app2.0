import { useCurrentUser } from "../query/useCurrentUser";
import { Navigate } from "react-router-dom";
/**
 * RootRedirect Component
 *
 * Intelligenter Redirect basierend auf Authentication Status:
 * - Eingeloggt → /machines (Hauptseite)
 * - Nicht eingeloggt → /login
 */
export function RootRedirect() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  // Zeige Loading während Auth-Check
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect basierend auf Auth Status
  return isAuthenticated ? (
    <Navigate to="/machines" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
