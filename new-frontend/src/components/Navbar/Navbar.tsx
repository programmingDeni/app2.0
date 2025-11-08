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
      // Logout: Clear tokens and redirect to login
      logoutUser();
    } else {
      // Navigate to login page
      navigate("/login");
    }
  };

    // Button ausblenden, wenn auf Login-Page
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left spacer for flex layout */}
        <div className={styles.leftSpacer}></div>

        {/* Center: Logo */}
        <div className={styles.logoContainer}>
          <img src={reactLogo} alt="Logo" className={styles.logo} />
        </div>

        {/* Right: Auth button */}
        <div className={styles.rightSection}>
          {!isLoginPage && ( // Button ausblenden, wenn auf Login-Page
          <button onClick={handleAuthAction} className={styles.authButton}>
            {isAuthenticated ? "Logout" : "Login"}
          </button>
          )}
          
        </div>
      </div>
    </nav>
  );
}
