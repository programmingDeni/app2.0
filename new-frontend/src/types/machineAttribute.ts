import { AttributeType } from "./attributeType";

export interface MachineAttributeDto {
  id: number;
  attributeName: string;
  attributeType: AttributeType;
}
