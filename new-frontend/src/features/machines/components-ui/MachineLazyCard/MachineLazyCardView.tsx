import { MachineLazy } from "@/types/machine";
import MachineLazyCardUI from "./MachineLazyCardUI";

interface Props {
  machine: MachineLazy;
  onDelete: (id: number) => void | Promise<void>;
}

export default function MachineLazyCardView({ machine, onDelete }: Props) {
  return <MachineLazyCardUI machine={machine} onRemove={onDelete} />;
}
