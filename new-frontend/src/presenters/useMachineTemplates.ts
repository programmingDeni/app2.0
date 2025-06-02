import { useCallback, useEffect, useState } from "react";
import { MachineTemplateDto } from "@/types/machineTemplate";
import { getAllMachineTemplatesWithAttributes } from "@/services/machineTemplate.service";

export function useMachineTemplates() {
  const [templates, setTemplates] = useState<MachineTemplateDto[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [errorTemplates, setErrorTemplates] = useState<Error | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await getAllMachineTemplatesWithAttributes();
      setTemplates(res.data);
    } catch (err) {
      setErrorTemplates(err as Error);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  return {
    templates,
    loadingTemplates,
    errorTemplates,
    refetchTemplates: fetch,
  };
}
