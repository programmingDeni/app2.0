//import der typ nahen hooks
import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import {
  createMachineFromTemplate,
  createMachineByName,
} from "@/services/machine.service";
import { useState } from "react";

export function useAddMachineFormPresenter(onMachineAdded: () => void) {
  const { templates, loadingTemplates, errorTemplates } = useMachineTemplates();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (templateId) {
      await createMachineFromTemplate({
        machineName: name,
        machineTemplateId: templateId,
      });
    } else {
      await createMachineByName({ name });
    }

    setName("");
    setTemplateId(null);
    onMachineAdded();
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
