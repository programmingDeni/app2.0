//presenter import
import { useMachines } from "@/features/machines/presenter/useMachines";
import useTemplates from "@/features/templates/hooks/useTemplates";

export function useMachineDetails(machineId: number) {
  const {
    machines,
    fetchMachine,
    assignTemplateToMachine,
    removeTemplateFromMachine,
    addCustomAttribute,
    removeCustomAttributeFromMachine,
  } = useMachines();
  const { machineTemplates } = useTemplates();

  const machine = machines.find((m) => m.id === machineId);

  // Template passend zur Maschine finden
  const template = machineTemplates.find(
    (t) => t.id === machine?.machineTemplate?.id
  );

  const refetchMachine = async (machineId: number) => {
    const machine = await fetchMachine(machineId);
    return machine;
  };

  return {
    machine,
    template,
    assignTemplateToMachine,
    removeTemplateFromMachine,
    addCustomAttribute,
    removeCustomAttributeFromMachine,
    refetchMachine,
  };
}
