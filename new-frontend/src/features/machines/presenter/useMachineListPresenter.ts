import { useEffect, useState } from "react";
//machine DTO / Model laden
import { MachineLazy } from "@/types/machine";
//Service laden
import { fetchMachinesLazy, removeMachine } from "../services/machineService";

export default function useMachineListPresenter() {
  const [machines, setMachines] = useState<MachineLazy[]>([]);

  useEffect(() => {
    fetchMachinesLocal();
  }, []);

  const fetchMachinesLocal = async () => {
    try {
      const res = await fetchMachinesLazy();
      setMachines(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeMachine(id);
      //
      setMachines((prev) => prev.filter((m) => m.machineId !== id));
    } catch (e) {
      console.log(e);
    }
  };

  const addMachineToList = (newMachine: MachineLazy) => {
    console.log("addedMachineToList", newMachine);
    setMachines((prev) => [...prev, newMachine]);
  };

  return {
    machines,
    handleDelete,
    addMachineToList,
  };
}
