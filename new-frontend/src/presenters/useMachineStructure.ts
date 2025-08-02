// presenters/useMachineStructure.ts
import { useState, useEffect, useCallback } from "react";
import {
  getMachineStructureByMachineId,
  assignTemplateToMachineById,
  removeTemplateFromMachineById,
} from "@/services/machine.service";
import { MachineStructureDto } from "@/types/machine";
import { CreateMachineAttributeDto } from "@/types/MachineAttributes/CreatemachineAttribute";
import { createAttribute } from "@/services/machineAttribute.service";

/* 
   Der hook soll alle Daten vom Backend laden, die für die Anzeige des MachineStructures benötigt werden.
   Am besten wäre es die API calls möglichst klein zu halten.
   Änderungen die nicht persistiert werden gehen verloren, wenn der user den browser schließt.


   Structure braucht folgende Services
   Machines:
    - get
    - assignTemplate
    - removeTemplate

  Attributes:
    - getAttributes (das holt custom und template )
    - addAttribute
    - removeAttribute
*/

export function useMachineStructure(machineId: number) {
  const [data, setData] = useState<MachineStructureDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMachineStructureByMachineId(machineId);
      setData(res.data);
      console.log("machineStructure", res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  //ASSIGN TEMPLATE
  const assignTemplateToMachine = async (templateId: number) => {
    // call backend sag dass ein template assigned werden soll
    try {
      //service call
      await assignTemplateToMachineById(machineId, templateId);
      //test obs hierrpber läuft
      await fetch();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  //REMOVE TEMPLATE
  const removeTemplateFromMachine = async () => {
    // call backend sag dass ein template von der machine entfernt werden soll
    try {
      //service call
      await removeTemplateFromMachineById(machineId);
      await fetch();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  //ADD ATTRIBUTE
  //erhält ein CreateMachineAttributeDto (name, type und machineId)
  const addAttributeToMachine = async (
    attribute: CreateMachineAttributeDto
  ) => {
    try {
      //ruft service auf ums im backend zu erstellen => bvackend returnt das neue attribut
      const res = await createAttribute(machineId, attribute);
      const newAttribute = res.data;

      //state update

      await fetch();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    machineStructure: data,
    loading,
    error,
    refetch: fetch,
    assignTemplateToMachine,
    removeTemplateFromMachine,
    addAttributeToMachine,
  };
}
