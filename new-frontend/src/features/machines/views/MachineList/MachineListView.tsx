// List View
// wird von presenter versorgt
import useMachineListPresenter from "../../presenter/useMachineListPresenter";
// UI der Listenelemente ist in MachineCard
import MachineCard from "../../components-ui/MachineCard";

export default function MachineListView() {
  const { machines, handleDelete } = useMachineListPresenter();

  return (
    <div>
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onDelete={() => handleDelete(machine.id)}
        />
      ))}
    </div>
  );
}
