import react, {useState} from "react";
import { CreateMachineByName, CreateMachineFromTemplate, Machine } from "@/shared/types/machine.types";
import AddMachineFormUI from "./AddMachineFormUI";
//query für backend communication
import { useQueryClient } from "@tanstack/react-query";
import { MachineQuery } from "@/queries/machine/MachineQuery";
import { TemplateQuery } from "@/queries/template/TemplateQuery";
import { QueryStateWrapper } from "@/shared/abstracts/QueryStateWrapper";

interface Props {}

export default function AddMachineFormView({}: Props) {
 const queryClient = useQueryClient();
 
 const machineQuery = new MachineQuery(queryClient);
 const addMachineQuery = machineQuery.useCreate()
 
 const templateQuery = new TemplateQuery(queryClient);
  const findAllTemplatesQuery = templateQuery.useFindAll(false);  
  
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);
  
  const resetForm = () => {
    setName("");
    setTemplateId(null);
  };

  const handleSubmit = (machine: CreateMachineByName | CreateMachineFromTemplate) =>{
    switch(machine.type){
      case 'byName':
        addMachineQuery.mutate(machine);
        break;
      case 'fromTemplate':
        //TODO: spezielle implementation
    }
    resetForm();
  }
  


  return (
    <QueryStateWrapper {...findAllTemplatesQuery} resourceName="Templates">
      {(templates) => (
          <AddMachineFormUI
            name={name}
            onNameChange={setName}
            selectedTemplateId={templateId}
            onTemplateChange={setTemplateId}
            templates={templates}
            onSubmit={handleSubmit}
          />
      ) }
      </QueryStateWrapper>
  );
}
