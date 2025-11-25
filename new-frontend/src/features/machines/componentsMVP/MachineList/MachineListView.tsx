// List View
// wird von query versorgt
import {
  useMachines,
  useAddMachine,
  useRemoveMachine,
} from "../../query/useMachineQueries";
// UI der Listenelemente ist in MachineCard
import MachineCard from "../../components-ui/MachineLazyCard";

//react
import react, { useState } from "react";

export default function MachineListView() {
  const { data: machines = [], refetch, isLoading, error } = useMachines();
  const deleteMachineMutation = useRemoveMachine();

  const handleDeleteMachine = async (machineId: number) => {
    const isConfirmed = window.confirm(
      "Sind Sie sicher, dass Sie diese Maschine löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
    );

    if (isConfirmed) {
      await deleteMachineMutation.mutateAsync(machineId);
      refetch();
    }
  };

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
    </div>
  );
}
