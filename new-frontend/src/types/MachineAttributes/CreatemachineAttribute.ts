import { AttributeType } from "@/types/attributeType";
// types/createMachineAttribute.ts
export interface CreateMachineAttributeDto {
  attributeName: string;
  attributeType: AttributeType;
  machineId: number;
}
