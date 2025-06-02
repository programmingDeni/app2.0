// hook/useMachineAttributesById.ts
import { useEffect, useState } from "react";
import { getAttributesByMachineId } from "@/services/machineAttribute.service";
import { MachineAttribute } from "@/types/machineAttribute";

export function useMachineAttributesByMachineId(machineId: number | string) {
  const [attributes, setAttributes] = useState<MachineAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!machineId) return;
    getAttributesByMachineId(Number(machineId))
      .then((res) => setAttributes(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [machineId]);

  return { attributes, loading, error };
}
