//import der typ nahen hooks
import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import {
  createMachineFromTemplate,
  createMachineByName,
} from "@/services/machine.service";
import { useState } from "react";
import { MachineLazy } from "@/types/machine";

export function useAddMachineFormPresenter(
  onMachineAdded: (machine: MachineLazy) => void
) {
  const { templates, loadingTemplates, errorTemplates } = useMachineTemplates();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      let newMachine: MachineLazy;
      console.log("im Presenter. Name : ", name, "template id:", templateId);

      if (templateId) {
        const response = await createMachineFromTemplate({
          machineName: name,
          machineTemplateId: templateId,
        });
        console.log("response in id", response);
        newMachine = response;
      } else {
        const response = await createMachineByName({ name });
        console.log("response outside id", response);
        newMachine = response;
      }

      setName("");
      setTemplateId(templateId);
      onMachineAdded(newMachine);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    name,
    setName,
    templateId,
    setTemplateId,
    templates,
    loading: loadingTemplates,
    error: errorTemplates,
    handleSubmit,
  };
}
