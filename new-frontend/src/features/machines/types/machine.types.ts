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

export interface MachineAttributesAndYearlyValues {
  machineId: number;
  attributes: MachineAttribute[];
}

export interface MachineAttribute {
  id: number;
  machineId: number;
  attributeName: string;
  attributeType: string;
  attributeValues: AttributeValue[];
  fromTemplate: boolean;
}

export interface AttributeValue {
  id: number;
  machineAttributeId: number;
  machineId: number;
  attributeValue: string;
  attributeValueYear: number;
}
