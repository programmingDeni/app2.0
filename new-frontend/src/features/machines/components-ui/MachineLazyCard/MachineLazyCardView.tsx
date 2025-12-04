import { Machine } from "@/shared/types/machine.types";
import MachineLazyCardUI from "./MachineLazyCardUI";

interface Props {
  machine: Machine;
  onDelete: (id: number) => void | Promise<void>;
}

export default function MachineLazyCardView({ machine, onDelete }: Props) {
  return <MachineLazyCardUI machine={machine} onRemove={onDelete} />;
}
