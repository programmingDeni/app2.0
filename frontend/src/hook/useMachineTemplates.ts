// src/hooks/useMachineTemplates.ts
import { useEffect, useState } from "react";
import { getAllMachineTemplates } from "@/app/services/machineTemplate.service";
import { MachineTemplate } from "@/types/machineTemplate";

export function useMachineTemplates() {
  const [machineTemplate, setMachineTemplate] = useState<MachineTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAllMachineTemplates()
      .then((res) => setMachineTemplate(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { machineTemplate, loading, error };
}
