// List View
// wird von query versorgt
import {
  useMachines,
  useAddMachine,
  useRemoveMachine,
} from "../../query/useMachineQueries";
//Machine Type
import { Machine } from "@/features/machines/types/machine.types";
// UI der Listenelemente ist in MachineCard
import MachineCard from "../../components-ui/MachineLazyCard";

import Button from "@/components/Button";

import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import AddMachineFormView from "../../componentsMVP/AddMachineFormMVP/AddMachineFormView";

//react
import react, { useState } from "react";

//ich will die types global definiert haben; nicht hier encapsulated
//da sie ja  global (frontend) gültig und mit dem backend sprechen und dessen struktur
// enthalten sollen

export default function MachineListView() {
  const { data: machines = [], refetch, isLoading, error } = useMachines();
  const deleteMachineMutation = useRemoveMachine();
  const addMachineMutation = useAddMachine();

  const handleDeleteMachine = async (machineId: number) => {
    const isConfirmed = window.confirm(
      "Sind Sie sicher, dass Sie diese Maschine löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
    );

    if (isConfirmed) {
      await deleteMachineMutation.mutateAsync(machineId);
      refetch();
    }
  };

  const handleAddMachine = async (machine: Partial<Machine>) => {
    addMachineMutation.mutateAsync(machine);
    refetch();
  };

  const [showAddMachineForm, setShowAddMachineForm] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  //if (machines.length === 0) return <div>No Machines</div>;

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      {machines.length === 0 ? (
        <div>Keine Maschinen vorhanden</div>
      ) : (
        machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onDelete={handleDeleteMachine}
          />
        ))
      )}

      <ToggleableSection
        toggleLabel="Add Machine"
        open={showAddMachineForm}
        onOpen={() => setShowAddMachineForm(true)}
        onClose={() => setShowAddMachineForm(false)}
      >
        <AddMachineFormView />
      </ToggleableSection>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button to="/machine-templates">→ Zu den Machine Templates</Button>
        <Button to="/print">→ Drucken</Button>
      </div>
    </div>
  );
}
