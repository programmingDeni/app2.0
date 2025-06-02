// presenters/useMachineStructure.ts
import { useState, useEffect, useCallback } from "react";
import {
  getMachineStructureByMachineId,
  assignTemplateToMachineById,
  removeTemplateFromMachineById,
} from "@/services/machine.service";
import { MachineStructureDto } from "@/types/machine";

/* 
   
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
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  const assignTemplateToMachine = async (templateId: number) => {
    // call backend sag dass ein template assigned werden soll
    try {
      //service call
      await assignTemplateToMachineById(machineId, templateId);
      await fetch();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const removeTemplateFromMachine = async () => {
    // call backend sag dass ein template assigned werden soll
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
  };
}
