import { AttributeType } from "./attributeType";
import { AttributeValueDto } from "./attributeValue";

export interface MachineAttributeDto {
  id: number;
  attributeName: string;
  attributeType: AttributeType;
  attributeValues: AttributeValueDto[];
  fromTemplate: boolean;
}
