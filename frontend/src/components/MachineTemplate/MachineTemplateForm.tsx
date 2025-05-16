"use client";
import React, { useState } from "react";
import axios from "axios";
import { MachineTemplate } from "@/types/machineTemplate";

interface Props {
  onTemplateCreated: () => void;
}

export default function MachineTemplateForm({ onTemplateCreated }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name darf nicht leer sein.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/machine-templates", {
        templateName: name,
      });
      onTemplateCreated();
      setSuccess(`Template '${name}' wurde erstellt!`);
      setName("");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Erstellen des Templates.");
      setSuccess(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Neues Maschinen-Template</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Template speichern
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
