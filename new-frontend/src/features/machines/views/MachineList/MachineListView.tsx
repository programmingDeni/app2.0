// List View
// wird von presenter versorgt
import useMachineListPresenter from "../../presenter/useMachineListPresenter";
// UI der Listenelemente ist in MachineCard
import MachineCard from "../../components-ui/MachineLazyCard";

import Button from "@/components/Button";

import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import AddMachineFormView from "../../../AddMachineFormMVP/AddMachineFormView";

//ich will die types global definiert haben; nicht hier encapsulated
//da sie ja  global (frontend) gültig und mit dem backend sprechen und dessen struktur
// enthalten sollen

import { MachineLazy } from "@/types/machine";

import { Link } from "react-router-dom";

export default function MachineListView() {
  const { machines, handleDelete, addMachineToList } =
    useMachineListPresenter();

  return (
    <div>
      {machines.map((machine) => (
        <div>
          <MachineCard
            key={machine.machineId}
            machine={machine}
            onDelete={handleDelete}
          />
        </div>
      ))}
      <ToggleableSection toggleLabel="Add Machine">
        <AddMachineFormView
          onMachineAdded={(newMachine) => {
            console.log("View onMachineAdded", newMachine);
            addMachineToList(newMachine);
          }}
        />
      </ToggleableSection>
      <Button to="/machine-templates">→ Zu den Machine Templates</Button>
    </div>
  );
}
