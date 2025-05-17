/*
public class AttributeValueDto {
    public Integer id;
    public int year;
    public Integer machineAttributeId;
    public String value;

    public AttributeValueDto() {}

    public AttributeValueDto(Integer id, int year, Integer machineAttributeId) {
        this.id = id;
        this.year = year;
        this.machineAttributeId = machineAttributeId;
        this.value = "";
    }

    public AttributeValueDto(Integer id,int year, Integer machineAttributeId, String value) {
        this.id = id;
        this.year = year;
        this.machineAttributeId = machineAttributeId;
        this.value = value;
    }
}
    */
export interface AttributeValue {
  id: number;
  attributeValueYear: number;
  machineAttributeId: number;
  attributeValue: string;
}
