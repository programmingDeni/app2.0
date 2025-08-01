import { MachineAttributeDto } from "./machineAttribute";

export interface MachineStructureDto {
  machineId: number;
  name: string;
  machineTemplateId: number | null;
  machineAttributes: MachineAttributeDto[];
  fromTemplate: boolean;
}

export interface MachineLazy {
  id: number;
  name: string;
  templateName: string;
}

export interface MachineWithAttributeValues {
  id: number;
  machineAttributes: MachineAttributeDto[];
  //attributeValues: MachineAttributeValue[];
}

export interface CreateMachineByNameDto {
  name: string;
}

export interface CreateMachineFromTemplateDto {
  machineName: string;
  machineTemplateId: number;
}
