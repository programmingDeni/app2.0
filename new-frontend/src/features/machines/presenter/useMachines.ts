// Hook für alle machine related operationen
// MACHINES CRUD
// MachineAttributes CRUD

//React
import { useEffect, useState } from "react";
import axios from "axios";

//Types
import { Machine, MachineAttribute } from "../types/machine.types";

//service
import {
  createMachineService,
  fetchMachinesService,
  removeMachineService,
} from "../services/machineService";

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machines  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //Create
  //returned true if success, false sonst
  const createMachine = async (machineName: string) => {};

  //Read
  const fetchMachines = async () => {
    try {
      const machinesResponse = await fetchMachinesService();
      console.log("machien FETCH data", machinesResponse);
      setMachines(machinesResponse);
      setSuccessMsg(
        "[" + machinesResponse.length + "] Maschinen erfolgreich geladen"
      );
    } catch (e) {
      handleError(e, "Fehler beim Laden der Maschinen.");
    }
  };

  //Update
  // ist eiogentlich nur das name update

  //Delete
  const removeMachine = async (machineId: number) => {
    try {
      const response = await removeMachineService(machineId);
      //state update
      if (response.status >= 200 && response.status < 300) {
        setMachines((prev) => prev.filter((m) => m.id !== machineId));
        setSuccessMsg(response.data.machineName + " erfolgreich gelöscht!");
      }
    } catch (e: any) {
      handleError(e, "Fehler beim Löschen der Maschine.");
    }
  };

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Attributes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //TODO: attribut verwaltung innerhalb der machinen

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Attributes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //hilfsmethode fehlerhandling
  const handleError = (e: any, defaultMsg = "Unbekannter Fehler") => {
    console.error(e);
    setSuccessMsg(null);
    if (axios.isAxiosError(e)) {
      setErrorMsg(
        e.response?.data?.message || e.response?.data?.error || defaultMsg
      );
    } else {
      setErrorMsg(defaultMsg);
    }
    console.error("Fehler:", e);
  };

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Rückgabe  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  return {
    machines,
    createMachine,
    removeMachine,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
  };
}
