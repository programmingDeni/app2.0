"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

//die backend response objekte laden
//import models einmal lazy machine nur name und template name; einmal die voelle machine mit attributen
//gpt mein keine models inportieren

//import types: einmal lazy und einmal struktur, zum senden ans backend
import {
  CreateMachineFromTemplate,
  CreateMachineByName,
} from "@/shared/types/machine.types";

//query
import { useQueryClient } from "@tanstack/react-query";
import { MachineQuery } from "@/queries/machine/MachineQuery";
import { MachineTemplateOperationsQuery } from "@/queries/machine/MachineTemplateOperationsQuery";

import TemplateSelect from "../TemplateSelect/TemplateSelect";

interface Props {
  onMachineAdded: () => void;
}

export default function AddMachineForm({ onMachineAdded }: Props) {
  const queryClient = useQueryClient();

  const machineQuery = new MachineQuery(queryClient);
  const machineTemplateOperationsQuery = new MachineTemplateOperationsQuery();

  const createMachineByName = machineQuery.useCreate();
  const createMachineFromTemplate =
    machineTemplateOperationsQuery.useCreateFromTemplate();

  const [newMachineName, setNewMachineName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  const handleSubmit = async () => {
    try {
      let res;
      // wenn template ausgewählt, dann anlegen aus Template, sonst normales create
      if (selectedTemplateId) {
        const payload: CreateMachineFromTemplate = {
          machineName: newMachineName,
          machineTemplateId: selectedTemplateId,
          type: "fromTemplate",
        };
        res = createMachineFromTemplate.mutate(payload);
      } else {
        res = createMachineByName.mutate({
          name: newMachineName,
          type: "byName",
        });
      }
      console.log("machine created", res);
      onMachineAdded(); // an übergeordnetes Element zurückgeben
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
      <TemplateSelect
        selectedTemplateId={selectedTemplateId}
        onChange={setSelectedTemplateId}
      />
      <button onClick={handleSubmit} disabled={!newMachineName.trim()}>
        Speichern
      </button>
    </div>
  );
}
