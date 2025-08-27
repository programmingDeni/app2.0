import { useEffect, useState } from "react";
import { MachineTemplateDto } from "@/types/machineTemplate";

//server importierren
import { fetchMachineTemplates } from "@/features/templates/services/templateService";

export default function useMachineTemplateCard() {
  const [machineTemplates, setMachineTemplates] = useState<
    MachineTemplateDto[]
  >([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const response = await fetchMachineTemplates();
      const data = response.data;
      setMachineTemplates(data);
    } catch (e) {
      console.error(e);
    }
  };

  return { machineTemplates };
}
