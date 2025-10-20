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

export interface AttributeValue {
  id: number;
  machineAttributeId: number;
  machineId: number;
  attributeValue: string;
  attributeValueYear: number;
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Types (new)  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import { Template } from "@/features/templates/types/template.types";

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

export type AttributeType = "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN";
