import { Machine } from "@/types/machine";
import { MachineTemplate } from "@/types";

export function getFilteredAndSortedMachines(
  machines: Machine[],
  searchTerm: string,
  templateKey: MachineTemplate | null,
  sortKey: "id" | "name" | "template"
): Machine[] {
  return machines
    .filter((machine) =>
      machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((machine) =>
      templateKey ? machine.machineTemplateDto?.id === templateKey.id : true
    )
    .sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name);
        case "template":
          return (a.machineTemplateDto?.templateName || "").localeCompare(
            b.machineTemplateDto?.templateName || ""
          );
        case "id":
          return a.id - b.id;
        default:
          return 0;
      }
    });
}
