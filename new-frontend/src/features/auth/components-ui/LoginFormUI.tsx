import react, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { LoginRequest } from "../types/LoginRequest";
import styles from "../styles/LoginFormUI.module.css";

interface LoginFormUIProps {
  onSubmit: (loginRequest: LoginRequest) => void;
  isLoading: boolean;
  error?: Error | null;
}

export const LoginFormUI = ({
  onSubmit,
  isLoading,
  error,
}: LoginFormUIProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error">{error.message}</div>}
        <div className={styles.buttonContainer}>
          <button className={styles.button} disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
