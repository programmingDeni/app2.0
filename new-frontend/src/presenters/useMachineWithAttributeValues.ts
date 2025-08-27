import { useState, useEffect } from "react";

import { MachineWithAttributeValues } from "@/types/machine";
import { getMachinesAttributesValuesByMachineId } from "@/services/machine.service";

export function useMachineWithAttributeValues(machineId: number) {
  const [machineWithAttributeValues, setMachineWithAttributeValues] =
    useState<MachineWithAttributeValues>();

  useEffect(() => {
    fetch();
  }, [machineId]);

  const fetch = async () => {
    try {
      const res = await getMachineWithAttributeValues(machineId);
      console.log("res", res);
      setMachineWithAttributeValues(res);
    } catch (err) {
      console.error("Fehler beim Abruf der Attribute Werte:", err);
    }
  };

  const getMachineWithAttributeValues = async (machineId: number) => {
    const res = await getMachinesAttributesValuesByMachineId(1);
    return res.data;
  };

  return {
    machineWithAttributeValues,
    refetch: fetch,
  };
}
