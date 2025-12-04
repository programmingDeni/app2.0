import react, { useState } from "react";
import { RegisterRequest } from "../types/RegisterRequest";

import styles from "../styles/LoginFormUI.module.css";
import { Link } from "react-router-dom";

interface RegisterFormUIProps {
  onSubmit: (registerRequest: RegisterRequest) => void;
  isLoading: boolean;
  error?: Error | null;
}
export const RegisterFormUI = ({
  onSubmit,
  isLoading,
  error,
}: RegisterFormUIProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, firstName, lastName });
  };

  return (
   <div className={styles.authContainer}>
  <div className={`card ${styles.authCard}`}>
    <h1 className={styles.authTitle}>Konto erstellen</h1>

    {error && <p className="form-error">{error.message}</p>}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">E-Mail</label>
        <input id="email" type="email" className="form-input" />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Passwort</label>
        <input id="password" type="password" className="form-input" />
      </div>

      <div className="form-group">
        <label htmlFor="firstName" className="form-label">Vorname</label>
        <input id="firstName" type="text" className="form-input"/>
      </div>

      <div className="form-group">
        <label htmlFor="lastName" className="form-label">Nachname</label>
        <input id="lastName" type="text" className="form-input"/>
      </div>

      <div className="form-actions">

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={isLoading}>
        {isLoading ? "Wird registriert..." : "Registrieren"}
      </button>
      </div>
    </form>

    <p className={styles.linkText}>
      Bereits ein Konto? <Link to="/login">Anmelden</Link>
    </p>
  </div>
</div>
  );
};
