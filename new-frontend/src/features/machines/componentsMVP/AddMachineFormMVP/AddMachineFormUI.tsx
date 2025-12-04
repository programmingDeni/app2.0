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
         type: 'fromTemplate',
        };
      } else {
        machine = {
          name: name,
          type:'byName'
        };
      }
    
    onSubmit(machine); 
  };

  return (
    <div className = "form-group">
      <input
        type="text"
        placeholder="Maschinenname"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="form-input"
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
