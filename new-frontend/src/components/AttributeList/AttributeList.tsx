import { MachineAttributeDto } from "@/types/machineAttribute";
import MachineAttributeCard from "@/components/MachineAttributeCard/MachineAttributeCard";

interface Props {
  attributes: MachineAttributeDto[];
}

export default function AttributeList({ attributes }: Props) {
  if (!attributes?.length) return <p>Keine Attribute vorhanden.</p>;

  return (
    <>
      {attributes.map((attr) => (
        <MachineAttributeCard key={attr.id} attribute={attr} />
      ))}
    </>
  );
}
