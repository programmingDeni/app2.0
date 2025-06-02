import { MachineAttribute } from "./machineAttribute";
import { MachineTemplate } from "./machineTemplate";

export interface Machine {
  id: number;
  name: string;
  attributes: MachineAttribute[];
  machineTemplateDto?: MachineTemplate;
}
