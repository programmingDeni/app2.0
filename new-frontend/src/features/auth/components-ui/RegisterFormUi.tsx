import react, { useState } from "react";
import { RegisterRequest } from "../types/RegisterRequest";

import styles from "../styles/LoginFormUI.module.css";

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
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {error && <div className="error">{error.message}</div>}
        <button disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};
