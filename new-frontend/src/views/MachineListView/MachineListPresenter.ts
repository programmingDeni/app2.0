//ein presenter der den kompletten 1st level view machginelistView den state zur verfügung stellt

import { MachineLazy } from "@/types/machine";
import { useState, useEffect } from "react";

export default function MachineListPresenter() {
  //state variablen definieren
  const [machines, setMachines] = useState<MachineLazy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddMachineForm, setShowAddMachineForm] = useState(false);

  //am anfang einmal die daten fetchen
  useEffect(() => {
    fetch();
  }, []);

  //add machine form anzeigen
  const toggleShowAddMachine = () => {
    setShowAddMachineForm(!showAddMachineForm);
  };

  return {
    machines,
    loading,
    error,
    refetch: fetch,
    showAddMachineForm,
    toggleShowAddMachine,
  };
}
