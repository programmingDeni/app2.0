import { MachineAttributeDto } from "./machineAttribute";

export interface MachineStructureDto {
  machineId: number;
  name: string;
  machineTemplateId: number | null;
  machineAttributes: MachineAttributeDto[];
}

export interface MachineLazy {
  id: number;
  name: string;
  templateName: string;
}

export interface CreateMachineByNameDto {
  name: string;
}

export interface CreateMachineFromTemplateDto {
  machineName: string;
  machineTemplateId: number;
}
