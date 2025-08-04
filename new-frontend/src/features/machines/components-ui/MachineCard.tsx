// components/MachineCard.tsx
import MachineLazy from "../types/machine.types";

interface Props {
  machine: MachineLazy;
  onDelete: () => void;
}

export default function MachineCard({ machine, onDelete }: Props) {
  return (
    <div className="border p-4 mb-2 rounded">
      <h3>{machine.name}</h3>
      <button onClick={onDelete} className="text-red-600">
        Löschen
      </button>
    </div>
  );
}
