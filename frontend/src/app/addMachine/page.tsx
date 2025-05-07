"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddMachine() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const checkNameExists = () => {
    // später implementieren oder backend antwort nutzen
    return false;
  };

  const checkSpelling = () => {
    if (name.trim().length === 0) {
      setError("Bitte geben Sie einen Namen ein!");
      return false;
    }

    if (name.length < 3) {
      setError("Der Name muss mindestens 3 Zeichen lang sein.");
      return false;
    }

    const regex = /^[a-zA-Z0-9äöüÄÖÜß\s-]+$/;
    if (!regex.test(name)) {
      setError(
        "Der Name darf nur Buchstaben, Zahlen, Leerzeichen und Bindestriche enthalten."
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleBack = () => {
    if (name.length >= 1) {
      const confirmLeave = window.confirm(
        "Es wurden Änderungen vorgenommen. Wenn du zurückgehst, gehen sie verloren. Fortfahren?"
      );
      if (!confirmLeave) return;
    }

    router.push("/"); // zurück zur vorherigen Seite
  };

  const addMachine = async () => {
    if (checkNameExists()) {
      alert("Maschine mit diesem Namen existiert bereits!");
      return;
    }
    if (!checkSpelling()) return;

    try {
      const response = await axios.post("http://localhost:8080/api/machines", {
        name: name,
      });
      const newMachine = response.data;
      console.log("Hinzugefügt:", newMachine);
      setName("");
      // Erfolgsmeldung anzeigen
      setSuccessMessage(
        `Maschine "${newMachine.name}" (ID ${newMachine.id}) wurde erfolgreich hinzugefügt.`
      );

      // Nach 3 Sekunden wieder ausblenden
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data || "Unbekannter Serverfehler";
        setError(typeof msg === "string" ? msg : "Fehlerhafte Antwortstruktur");
      } else {
        console.log("Unknown Error");
      }
    }
  };

  return (
    <div>
      <h2>Neue Maschine hinzufügen</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Maschinenname"
      />
      {error && <p>{error}</p>}
      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}

      <button onClick={addMachine}>Hinzufügen</button>
      <button onClick={handleBack} style={{ marginTop: "1rem" }}>
        Zurück
      </button>
    </div>
  );
}
