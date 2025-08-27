//react state importieren
import { useState, useEffect } from "react";
//type importieren
import { MachineLazy } from "@/types/machine";
// services importieren
import {
  getAllMachineNamesAndTemplateName,
  deleteMachine,
} from "@/services/machine.service";

//presenter importieren // nein wir machen es jezuz nach features aufgeteilt
//import { useMachineListLazy } from "@/presenters/useMachineListLazy";
//der hooik holt sich alle daten von den services selbst

export default function useMachineListLazyPresenter() {
  const [machines, setMachines] = useState<MachineLazy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    getAllMachineNamesAndTemplateName()
      .then((res) => setMachines(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const removeMachine = async (machineId: number) => {
    try {
      //remove machine service call
      await deleteMachine(machineId);
      // aus dem state local
      setMachines((prev) => prev.filter((m) => m.id !== machineId));
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    machines,
    loading,
    error,
    refetch: fetch,
    removeMachine,
  };
}
