"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const attributeTypes = ["STRING", "INTEGER", "FLOAT", "BOOLEAN"];

export default function AddAttribute() {
  // benötigte attribute
  const [attributeName, setAttributeName] = useState("");
  const [type, setType] = useState("STRING");

  // id
  const searchParams = useSearchParams();
  const machineIdParam = searchParams.get("machineId");
  const machineId = machineIdParam ? parseInt(machineIdParam) : null;

  //response und error
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addAttribute = async () => {
    if (!attributeName.trim()) {
      setError("Bitte geben Sie einen Attributnamen ein.");
      return;
    }

    try {
      console.log(
        "machineId",
        machineId,
        "attributename",
        attributeName,
        "type",
        type
      );
      const response = await axios.post(
        "http://localhost:8080/api/attributes",
        {
          machineId,
          attributeName,
          attributeType: type,
        }
      );

      setMessage(
        `Attribut "${response.data.attributeName}" erfolgreich hinzugefügt.`
      );
      setAttributeName("");
      setType("STRING");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Hinzufügen des Attributs.");
    }
  };

  return (
    <div>
      <h2>Neues Attribut hinzufügen</h2>
      <input
        type="text"
        placeholder="Attributname"
        value={attributeName}
        onChange={(e) => setAttributeName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {attributeTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button onClick={addAttribute}>Hinzufügen</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
