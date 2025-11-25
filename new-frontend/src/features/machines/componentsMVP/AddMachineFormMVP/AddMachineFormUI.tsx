import Button from "@/shared/components/Buttons/GenericButton";
import TemplateSelect from "../../../../components/TemplateSelect/TemplateSelect";
import { Template } from "@/shared/types/template.types";
import { CreateMachineByName, CreateMachineFromTemplate, Machine } from "@/shared/types/machine.types";

interface Props {
  name: string;
  onNameChange: (val: string) => void;
  selectedTemplateId: number | null;
  onTemplateChange: (id: number | null) => void;
  onSubmit: (machine: CreateMachineByName | CreateMachineFromTemplate) => void;
  templates: Template[];
}

export default function AddMachineFormUI({
  name,
  onNameChange,
  selectedTemplateId,
  onTemplateChange,
  onSubmit,
  templates,
}: Props) {

   const handleSubmit = () => {
     
     if (!name.trim()) return;
     
     let machine: CreateMachineByName | CreateMachineFromTemplate;
     
     if (selectedTemplateId !== null) {
       machine = {
         machineName: name,
         machineTemplateId: selectedTemplateId,
        };
      } else {
        machine = {
          name: name,
        };
      }
    
    onSubmit(machine); // ← Machine zurückgeben!
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Maschinenname"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TemplateSelect
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onChange={onTemplateChange}
      />
      <Button onClick={handleSubmit} disabled={!name.trim()}>
        Speichern
      </Button>
    </div>
  );
}
