// Hook für alle machine related operationen
// MACHINES CRUD + assignTempalte + removeTemplate
// MachineAttributes CRUD

//React
import { useEffect, useState } from "react";
import axios from "axios";

//Types
import { Machine, MachineAttribute } from "../types/machine.types";

//service
import {
  createMachineAttributeService,
  fetchMachinesService,
  removeMachineService,
  fetchMachineService,
  removeAttributeFromMachineService,
} from "../services/machineService";
import { AttributeType } from "@/types/attributeType";

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
  //eine machine, wenn ich gezielt vom backend nach laden will?
  const fetchMachine = async (machineId: number) => {
    try {
      const response = await fetchMachineService(machineId);

      //TODO: state der machine updaten
      /*
      setMachines((prev) =>
        prev.map((m) => (m.id === machineId ? response.data : m))
      );
      */
      return response.data;
    } catch (e) {
      throw e;
    }
  };
  //alle machinen
  const fetchMachines = async () => {
    try {
      const machinesResponse = await fetchMachinesService();
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

  const assignTemplateToMachine = async (
    machineId: number,
    templateId: number
  ) => {};

  const removeTemplateFromMachine = async (machineId: number) => {};

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Attributes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //TODO: attribut verwaltung innerhalb der machinen
  const addCustomAttribute = async (
    machineId: number,
    attributeName: string,
    attributeType: AttributeType
  ) => {
    try {
      const response = await createMachineAttributeService(
        machineId,
        attributeName,
        attributeType
      );
      console.log("response", response, "machines", machines);
      if (response.status >= 200 && response.status < 300) {
        const newAttribute = response.data;
        // State aktualisieren:
        setMachines((prev) =>
          prev.map((machine) =>
            machine.id === machineId
              ? {
                  ...machine,
                  attributes: [...(machine.attributes || []), newAttribute],
                }
              : machine
          )
        );
        return newAttribute;
      }
    } catch (e) {
      throw e;
    }
  };

  const removeAttributeFromMachine = async (
    machineId: number,
    attributeId: number
  ) => {
    try {
      const response = await removeAttributeFromMachineService(
        machineId,
        attributeId
      );
      //TODO: state update
      if (response.status >= 200 && response.status < 300) {
        setMachines((prev) =>
          prev.map((m) =>
            m.id !== machineId
              ? m
              : {
                  ...m,
                  attributes: m.attributes?.filter((a) => a.id !== attributeId),
                }
          )
        );
      }
    } catch (e) {
      throw e;
    }
  };

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% HilfsMethoden  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
    fetchMachine,
    createMachine,
    removeMachine,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    assignTemplateToMachine,
    removeTemplateFromMachine,
    addCustomAttribute,
    removeAttributeFromMachine,
  };
}
