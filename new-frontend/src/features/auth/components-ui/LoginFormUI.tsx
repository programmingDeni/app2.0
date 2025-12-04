import react, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className={`card ${styles.authCard}`}>
        <h1 className={styles.authTitle}>Anmelden</h1>
        {error && <p className="form-error">{error.message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-actions">
          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={isLoading}
          >
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </button>

          </div>
        </form>
        <div className={styles.divider}>
          {" "}
          <span>Neu hier?</span>
        </div>

        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={() => navigate("/register")}
        >
          Konto erstellen
        </button>
      </div>
    </div>
  );
};
