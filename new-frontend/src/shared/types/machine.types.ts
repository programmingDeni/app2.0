import { Template } from "@/shared/types/template.types";

export interface MachineLazy {
  id: number;
  name: string;
  machineTemplateId: number;
}

export interface CreateMachineByName {
  type: 'byName';
  name: string;
}

export interface CreateMachineFromTemplate {
  type: 'fromTemplate';
  machineName: string;
  machineTemplateId: number;
}

export interface MachineAttributesAndYearlyValues {
  machineId: number;
  attributes: MachineAttribute[];
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Types (new)  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export interface Machine {
  id?: number;
  machineName: string;
  attributes: MachineAttribute[];
  machineTemplate: Template;
}

export interface MachineAttribute {
  id: number;
  machineId: number;
  attributeName: string;
  attributeType: string;
  attributeValues: AttributeValue[];
  fromTemplate: boolean;
  pruefungsIntervall?: number;
  zuletztGeprueft?: string;
  zuletztGetauscht?: string;
}

export interface AttributeValue {
  id: number;
  machineAttributeId: number;
  machineId: number;
  attributeValue: string;
  attributeValueYear: number;
  zuletztGeprueft?: string;
  zuletztGetauscht?: string;
}

export type AttributeType = "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN";
