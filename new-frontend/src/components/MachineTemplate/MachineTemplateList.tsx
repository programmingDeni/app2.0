import { MachineTemplateDto } from "@/types/machineTemplate";
import MachineTemplateCard from "@/components/MachineTemplate/MachineTemplateCard";

interface Props {
  machineTemplates: MachineTemplateDto[];
}

export function MachineTemplateList({ machineTemplates }: Props) {
  if (!machineTemplates?.length) return <p>Keine Templates gefunden.</p>;
  return (
    <>
      {machineTemplates.map((template) => (
        <MachineTemplateCard key={template.id} template={template} />
      ))}
    </>
  );
}
