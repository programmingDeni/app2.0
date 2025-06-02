// src/presenters/useMachineListLazy.ts
import { useEffect, useState } from "react";
import { getAllMachineNamesAndTemplateName } from "@/services/machine.service";
import { MachineLazy } from "@/types/machine";

export function useMachineListLazy() {
  const [machines, setMachines] = useState<MachineLazy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getAllMachineNamesAndTemplateName()
      .then((res) => setMachines(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { machines, loading, error, refetch: fetch };
}
