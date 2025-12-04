//import der typ nahen hooks
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TemplateQuery } from "@/queries/template/TemplateQuery";

export function useAddMachineFormPresenter() {
  const queryClient = useQueryClient();
  const templateQuery = new TemplateQuery(queryClient);
  const findAllTemplatesQuery = templateQuery.useFindAll(false);
  
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
