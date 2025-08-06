package com.example.machine_management.dto.AttributeValue;

public class CreateAttributeValueDto {
    public Integer machineId;
    public Integer attributeId;
    public String attributeValue;
    public int attributeValueYear;

    public CreateAttributeValueDto() {
    }

    public CreateAttributeValueDto(Integer machineId, Integer attributeId, String attributeValue,
            int attributeValueYear) {
        this.machineId = machineId;
        this.attributeId = attributeId;
        this.attributeValue = attributeValue;
        this.attributeValueYear = attributeValueYear;
    }

}
