import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/query/useCurrentUser";
import reactLogo from "@/assets/react.svg";
import styles from "./Navbar.module.css";
import { useLogout } from "@/features/auth/query/useLogout";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const { mutate: logoutUser } = useLogout();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logoutUser();
    } else {
      navigate("/login");
    }
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const hideAuthButton = isLoginPage || isRegisterPage;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left: Back & Home */}
        <div className={styles.leftSection}>
          {!hideAuthButton && (
            <>
            <button onClick={() => navigate(-1)} className="btn btn--ghost btn--icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={() => navigate("/home")} className="btn btn--ghost btn--icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
            </>
          )}
        </div>

        {/* Center: Logo */}
        <div className={styles.logoContainer}>
          <img src={reactLogo} alt="Logo" className={styles.logo} />
        </div>

        {/* Right: Logout */}
        <div className={styles.rightSection}>
          {!hideAuthButton && (
            <button onClick={handleAuthAction} className="btn btn--ghost btn--icon">
              {isAuthenticated ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}