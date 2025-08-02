// src/views/MachineListView/MachineListView.tsx
import React, { useState } from "react";

//importiere Presenter: dieser stellt den state zur verfügung
import { useMachineListLazy } from "@/presenters/useMachineListLazy";

//importiere Komponenten
//addmachineForm: MVP strukturierte funktionale komponente, wiederverwendbar , kapselt logic zum hinzufügen einer machine
import AddMachineFormView from "@/components/AddMachineFormMVP";

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
      {showAddMachineForm && <AddMachineFormView onMachineAdded={refetch} />}

      <Button onClick={toggleShowAddMachine}>
        {showAddMachineForm ? "Abbrechen" : "+ Maschine hinzufügen"}
      </Button>
      <Button to="/machine-templates">→ Zu den Machine Templates</Button>
    </div>
  );
}
