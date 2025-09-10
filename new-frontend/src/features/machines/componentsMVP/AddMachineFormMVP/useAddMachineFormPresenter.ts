//import der typ nahen hooks
import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import { useState } from "react";

export function useAddMachineFormPresenter() {
  const { templates, loadingTemplates, errorTemplates } = useMachineTemplates();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);

  const resetForm = () => {
    setName("");
    setTemplateId(null);
  };

  return {
    name,
    setName,
    templateId,
    setTemplateId,
    templates,
    loading: loadingTemplates,
    error: errorTemplates,
    resetForm,
  };
}
