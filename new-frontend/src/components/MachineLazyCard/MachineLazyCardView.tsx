import { MachineLazy } from "@/types/machine";
import MachineLazyCardUI from "./MachineLazyCardUI";

interface Props {
  machine: MachineLazy;
  onRemove: () => void;
}

export default function MachineLazyCardView({ machine, onRemove }: Props) {
  return <MachineLazyCardUI machine={machine} onRemove={onRemove} />;
}
