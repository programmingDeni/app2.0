import { MachineAttributeDto } from "./machineAttribute";

export interface MachineStructureDto {
  machineId: number;
  machineName: string;
  machineTemplateId: number | null;
  machineAttributes: MachineAttributeDto[];
  fromTemplate: boolean;
}

export interface MachineListElement {
  machineId: number;
  machineName: string;
  machineTempalteName: string;
}

export interface MachineLazy {
  machineId: number;
  machineName: string;
  templateName: string;
}

export interface MachineWithAttributeValues {
  id: number;
  machineAttributes: MachineAttributeDto[];
  //attributeValues: MachineAttributeValue[];
}

export interface CreateMachineByName {
  machineName: string;
}

export interface CreateMachineFromTemplate {
  machineName: string;
  machineTemplateId: number;
}

export interface Machine {
  id: number;
  name: string;
  templateName: string;
  machineAttributes: MachineAttributeDto[];
}
