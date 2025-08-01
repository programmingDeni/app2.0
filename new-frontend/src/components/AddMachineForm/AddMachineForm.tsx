"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

//die backend response objekte laden
//import models einmal lazy machine nur name und template name; einmal die voelle machine mit attributen
//gpt mein keine models inportieren

//import types: einmal lazy und einmal struktur, zum senden ans backend
import {
  CreateMachineFromTemplateDto,
  CreateMachineByNameDto,
} from "@/types/machine";

//machine template from backend laden
import { MachineTemplateDto } from "@/types/machineTemplate";

//import services
import {
  createMachineByName,
  createMachineFromTemplate,
} from "@/services/machine.service";

import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import TemplateSelect from "../TemplateSelect/TemplateSelect";

interface Props {
  onMachineAdded: () => void;
}

export default function AddMachineForm({ onMachineAdded }: Props) {
  const { templates, loadingTemplates, errorTemplates } = useMachineTemplates();

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
        res = await createMachineByName({
          name: newMachineName,
        });
      }
      console.log("machine created", res.data);
      onMachineAdded(); // an übergeordnetes Element zurückgeben
      setNewMachineName("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };

  if (loadingTemplates) return <p>lade Templates...</p>;
  if (errorTemplates) return <p>Fehler beim Laden</p>;

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Maschinenname"
        value={newMachineName}
        onChange={(e) => setNewMachineName(e.target.value)}
      />
      <TemplateSelect
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onChange={setSelectedTemplateId}
      />
      <button onClick={handleSubmit} disabled={!newMachineName.trim()}>
        Speichern
      </button>
    </div>
  );
}
