// src/hooks/useMachineTemplates.ts
import { useEffect, useState } from "react";
import { getAllMachineTemplates } from "@/services/machineTemplate.service";
import { MachineTemplate } from "@/types/machineTemplate";

export function useMachineTemplates() {
  const [machineTemplates, setMachineTemplates] = useState<MachineTemplate[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAllMachineTemplates()
      .then((res) => setMachineTemplates(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { machineTemplates, loading, error };
}
