import AddMachineFormView from "@/components/AddMachineFormMVP";
import MachineListLazyView from "@/components/MachineListLazy";
import Button from "@/components/Button";
import { MachineLazy } from "@/types/machine";

interface Props {
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onMachineAdded: () => void;
}

export default function MachineListUI({
  showAddForm,
  onToggleAddForm,
  onMachineAdded,
}: Props) {
  return (
    <div>
      <h2>Maschinenliste ("Startseite")</h2>
      <MachineListLazyView />
      {showAddForm && <AddMachineFormView onMachineAdded={onMachineAdded} />}
      <Button onClick={onToggleAddForm}>
        {showAddForm ? "Abbrechen" : "+ Maschine hinzufügen"}
      </Button>
      <Button to="/machine-templates">→ Zu den Machine Templates</Button>
    </div>
  );
}
