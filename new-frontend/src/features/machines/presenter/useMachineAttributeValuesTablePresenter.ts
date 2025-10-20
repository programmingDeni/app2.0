import { useEffect, useState } from "react";
import { MachineAttribute } from "../types/machine.types";
import { getMachineAttributesWithYearlyValues } from "../services/machineService";

import { addAttributeValue } from "../services/attributeValueService";

export function useMachineAttributesPresenter(machineId: number) {
  const [machineName, setMachineName] = useState<string>("");
  const [attributes, setAttributes] = useState<MachineAttribute[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMachineAttributes(machineId);
  }, [machineId]);

  const fetchMachineAttributes = async (machineId: number) => {
    try {
      const response = await getMachineAttributesWithYearlyValues(machineId);
      setAttributes(response.attributes ?? []);
      setMachineName(response.machineName);
      console.log(
        "attributes received in ValuesPresenter",
        response.attributes
      );
    } catch (e) {
      console.log(e);
      setError(e as Error);
    }
  };

  const handleAddAttributeValue = async (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => {
    //api call
    const newAttributeValueYear = await addAttributeValue({
      machineId,
      machineAttributeId: attributeId,
      attributeValue,
      attributeValueYear: year,
    });
    //state update
    const attr = attributes.find((attr) => attr.id === attributeId);
    if (!attr) return;

    attr.attributeValues.push({
      id: newAttributeValueYear.id,
      machineAttributeId: attributeId,
      machineId,
      attributeValue,
      attributeValueYear: year,
    });
  };

  return { machineName, attributes, handleAddAttributeValue, error };
}
