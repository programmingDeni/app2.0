import { MachineAttributeDto } from "@/types/machineAttribute";

interface Props {
  attribute: MachineAttributeDto;
}

export default function MachineAttributeCard({ attribute }: Props) {
  return (
    <div className="border rounded p-2 mb-2 shadow-sm">
      <strong>{attribute.attributeName}</strong>{" "}
      <em>({attribute.attributeType})</em>
    </div>
  );
}
