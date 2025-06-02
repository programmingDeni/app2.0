import React, { useEffect, useState } from "react";

import { MachineAttribute } from "@/types/machineAttribute";

import { getAllAttributes } from "@/services/machineAttribute.service";

export function useMachineAttribute() {
  const [attributes, setAttributes] = useState<MachineAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAllAttributes()
      .then((res) => setAttributes(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { attributes, loading, error };
}
