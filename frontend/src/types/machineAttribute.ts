import { AttributeType } from "./attributeInTemplate";

export interface MachineAttribute {
  id: number;
  attributeName: string;
  attributeType: AttributeType;
  value: string;
}
