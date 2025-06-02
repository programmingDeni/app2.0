// src/views/MachineListView/MachineListView.tsx
import React, { useState } from "react";

import { useMachineListLazy } from "@/presenters/useMachineListLazy";

import AddMachineForm from "@/components/AddMachineForm";
import MachineListLazy from "@/components/MachineListLazy/MachineListLazy";
import Button from "@/components/Button";

export default function MachineListView() {
  const { machines, loading, error, refetch } = useMachineListLazy();

  const [showAddMachineForm, setShowAddMachineForm] = useState(false);

  const toggleShowAddMachine = async () => {
    setShowAddMachineForm(!showAddMachineForm);
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error.message}</p>;

  return (
    <div>
      <h2>Maschinenliste (Lazy)</h2>
      <MachineListLazy machines={machines} />
      {showAddMachineForm && <AddMachineForm onMachineAdded={refetch} />}

      <Button onClick={toggleShowAddMachine}>
        {showAddMachineForm ? "Abbrechen" : "+ Maschine hinzufügen"}
      </Button>
      <Button to="/machine-templates">→ Zu den Machine Templates</Button>
    </div>
  );
}
