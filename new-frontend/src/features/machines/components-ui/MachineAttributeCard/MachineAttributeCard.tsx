import { MachineAttribute } from "@/features/machines/types/machine.types";

interface Props {
  attribute: Partial<MachineAttribute>;
}

export default function MachineAttributeCard(props: Props) {
  const attribute = props.attribute;

  if (!attribute) return <div>Keine Attribute vorhanden</div>;

  if (!attribute.attributeName) return <div>Kein Attributname vorhanden</div>;

  return (
    <div className="border rounded p-2 mb-2 shadow-sm">
      <strong>{attribute.attributeName}</strong>{" "}
      <em>({attribute.attributeType})</em>
    </div>
  );
}

/*
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
*/
