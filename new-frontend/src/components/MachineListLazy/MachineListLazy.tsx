import { MachineLazy } from "@/types/machine";
import MachineLazyCard from "../MachineLazyCard/MachineLazyCard";

interface Props {
  machines: MachineLazy[];
}

export default function MachineListLazy({ machines }: Props) {
  if (!machines?.length) return <p>Keine Maschinen vorhanden.</p>;

  return (
    <ul>
      {machines.map((machine) => (
        <MachineLazyCard key={machine.id} machine={machine} />
      ))}
    </ul>
  );
}
