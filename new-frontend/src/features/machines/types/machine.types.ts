export interface MachineLazy {
  id: number;
  name: string;
  machineTemplateId: number;
}

export interface CreateMachineByName {
  name: string;
}

export interface CreateMachineFromTemplate {
  machineName: string;
  machineTemplateId: number;
}
