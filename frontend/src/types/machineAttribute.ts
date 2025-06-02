import { AttributeType } from "./attributeInTemplate";
import { AttributeValue } from "./AttributeValue";

export interface MachineAttribute {
  id: number;
  attributeName: string;
  attributeType: AttributeType;
  attributeValues: AttributeValue[];
  machineId: number;
}
/*  Backend Dto
    public MachineAttributeDto(int id, String attributeName, String attributeType,
     List<AttributeValueDto> attributeValues, Integer machineId) {
        this.id = id;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValues = attributeValues;
        this.machineId = machineId;
    }
*/
