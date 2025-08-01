import {
  createAttribute,
  removeAttributeFromMachineService,
} from "@/services/machineAttribute.service";
import { MachineAttributeDto } from "@/types/machineAttribute";
import { CreateMachineAttributeDto } from "@/types/MachineAttributes/CreatemachineAttribute";
import { useState, useEffect, useCallback } from "react";

export function useMachineAttributes(machineId: number) {
  const [data, setData] = useState<MachineAttributeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(async () => {
    //TODO:
    setLoading(true);
    try {
      //const res = await getMachineAttributes(machineId);
      //setData(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttributetoMachine = async (
    attribute: CreateMachineAttributeDto
  ) => {
    try {
      await createAttribute(attribute);
      fetch();
    } catch (err) {
      setError(err as Error);
    }
  };

  const removeAttributeFromMachine = async (attributeId: number) => {
    //TODO:
    try {
      await removeAttributeFromMachineService(attributeId);
      fetch();
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    fetch,
    data,
    loading,
    error,
    refetch: fetch,
    addAttributetoMachine,
    removeAttributeFromMachine,
  };
}
