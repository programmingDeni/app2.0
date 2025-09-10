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
  const { data: machines = [], refetch } = useMachines();
  const deleteMachineMutation = useRemoveMachine();
  const addMachineMutation = useAddMachine();

  const handleDeleteMachine = async (machineId: number) => {
    await deleteMachineMutation.mutateAsync(machineId);
    refetch();
  };

  const handleAddMachine = async (machine: Partial<Machine>) => {
    addMachineMutation.mutateAsync(machine);
    refetch();
  };

  const [showAddMachineForm, setShowAddMachineForm] = useState(false);

  return (
    <div>
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onDelete={handleDeleteMachine}
        />
      ))}
      <ToggleableSection
        toggleLabel="Add Machine"
        open={showAddMachineForm}
        onOpen={() => setShowAddMachineForm(true)}
        onClose={() => setShowAddMachineForm(false)}
      >
        <AddMachineFormView />
      </ToggleableSection>
      <Button to="/machine-templates">→ Zu den Machine Templates</Button>
    </div>
  );
}
