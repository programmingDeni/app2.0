import { MachineLazy } from "@/types/machine";
import MachineLazyCard from "../MachineLazyCard";

interface Props {
  machines: MachineLazy[];
  onremoveMachine: (machineId: number) => void;
}

export default function MachineListLazyUI({
  machines,
  onremoveMachine,
}: Props) {
  if (!machines?.length) return <p>Keine Maschinen vorhanden.</p>;

  return (
    <ul>
      {machines.map((m) => (
        <MachineLazyCard
          key={m.id}
          machine={m}
          onRemove={() => onremoveMachine(m.id)}
        />
      ))}
    </ul>
  );
}
