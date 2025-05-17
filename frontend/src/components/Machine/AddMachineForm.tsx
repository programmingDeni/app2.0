"use client";
import React, { useState } from "react";
import axios from "axios";
import { Machine } from "@/types/machine";
import { createMachine } from "@/app/services/machine.service";

interface Props {
  onMachineAdded: (machine: Machine) => void;
  onCancel: () => void;
}

export default function AddMachineForm({ onMachineAdded, onCancel }: Props) {
  const [newMachineName, setNewMachineName] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await createMachine({
        name: newMachineName,
      });
      onMachineAdded(res.data); // an übergeordnetes Element zurückgeben
      setNewMachineName("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Maschinenname"
        value={newMachineName}
        onChange={(e) => setNewMachineName(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={!newMachineName.trim()}>
        Speichern
      </button>
      <button onClick={onCancel} style={{ marginLeft: "8px" }}>
        Abbrechen
      </button>
    </div>
  );
}
