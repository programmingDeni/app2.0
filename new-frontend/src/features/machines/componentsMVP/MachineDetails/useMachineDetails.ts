//presenter import
import { useMachines } from "@/features/machines/presenter/useMachines";
import useTemplates from "@/features/templates/hooks/useTemplates";

export function useMachineDetails(machineId: number) {
  const { machines } = useMachines();
  const { machineTemplates } = useTemplates();

  const machine = machines.find((m) => m.id === machineId);

  // Template passend zur Maschine finden
  const template = machineTemplates.find(
    (t) => t.id === machine?.machineTemplate?.id
  );

  return {
    machine,
    template,
  };
}
