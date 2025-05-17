"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

//import types
import { Machine } from "@/types/machine";
import { MachineTemplate } from "@/types/machineTemplate";
import { CreateMachineFromTemplateDto } from "@/types/CreateMachineFromTemplate";
//import services
import {
  createMachine,
  createMachineFromTemplate,
} from "@/app/services/machine.service";
import { getAllMachineTemplates } from "@/app/services/machineTemplate.service";
import { useMachineTemplates } from "@/hook/useMachineTemplates";

interface Props {
  onMachineAdded: (machine: Machine) => void;
  onCancel: () => void;
}

export default function AddMachineForm({ onMachineAdded, onCancel }: Props) {
  const { machineTemplate, loading, error } = useMachineTemplates();
  const [newMachineName, setNewMachineName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  const handleSubmit = async () => {
    try {
      let res;
      // wenn template ausgewählt, dann anlegen aus Template, sonst normales create
      if (selectedTemplateId) {
        const payload: CreateMachineFromTemplateDto = {
          machineName: newMachineName,
          machineTemplateId: selectedTemplateId,
        };
        res = await createMachineFromTemplate(payload);
      } else {
        res = await createMachine({
          name: newMachineName,
        });
      }
      console.log("machine created", res.data);
      onMachineAdded(res.data); // an übergeordnetes Element zurückgeben
      setNewMachineName("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };

  if (loading) return <p>lade Templates...</p>;
  if (error) return <p>Fehler beim Laden</p>;

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Maschinenname"
        value={newMachineName}
        onChange={(e) => setNewMachineName(e.target.value)}
      />

      <select
        value={selectedTemplateId ?? ""}
        onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
      >
        <option value="" disabled>
          Template auswählen
        </option>
        {machineTemplate.map((template) => (
          <option key={template.id} value={template.id}>
            {template.templateName}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={!newMachineName.trim()}>
        Speichern
      </button>
      <button onClick={onCancel} style={{ marginLeft: "8px" }}>
        Abbrechen
      </button>
    </div>
  );
}
