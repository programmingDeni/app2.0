import React, { useEffect, useState } from "react";
import { Machine } from "@/types/machine";
import { AttributeValue } from "@/types/AttributeValue";
import {
  getMachineById,
  updateMachine,
  getAllMachines,
} from "@/services/machine.service";

export function useMachine(machineId: number) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);

  // Machine laden
  useEffect(() => {
    if (!machineId) return;
    setLoading(true);
    getMachineById(machineId)
      .then((res) => {
        setMachine(res.data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [machineId]);

  const updateName = async (newName: string) => {
    if (!machine) return;
    const updated = { ...machine, name: newName };
    const res = await updateMachine(machine.id, updated);
    setMachine(res.data);
  };

  const addAttribute = (attr: Machine["attributes"][0]) => {
    setMachine((prev) =>
      prev ? { ...prev, attributes: [...prev.attributes, attr] } : prev
    );
  };

  const removeAttribute = (attrId: number) => {
    setMachine((prev) =>
      prev
        ? {
            ...prev,
            attributes: prev.attributes.filter((a) => a.id !== attrId),
          }
        : prev
    );
  };

  const addValue = (attrId: number, newVal: AttributeValue) => {
    setMachine((prev) =>
      prev
        ? {
            ...prev,
            attributes: prev.attributes.map((a) =>
              a.id === attrId
                ? { ...a, attributeValues: [...a.attributeValues, newVal] }
                : a
            ),
          }
        : prev
    );
  };

  const getAllMachinesWrapper = async () => {
    try {
      const res = await getAllMachines();
      console.log("got machines :", res.data);
      setMachines(res.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Maschinen:", error);
    }
  };

  return {
    machine,
    machines,
    loading,
    error,
    updateName,
    addAttribute,
    removeAttribute,
    addValue,
  };
}
