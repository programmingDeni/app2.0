import { MachineAttribute } from "./machineAttribute";

export interface Machine {
  id: number;
  name: string;
  attributes: MachineAttribute[];
}
