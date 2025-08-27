package com.example.machine_management.dto.AttributeValue;

import com.example.machine_management.models.MachineAttribute;

public class AttributeValueDto {
    public Integer id;
    public int attributeValueYear;
    public Integer machineAttributeId;
    public String attributeValue;

    public AttributeValueDto() {
    }

    public AttributeValueDto(Integer id, int attributeValueYear, Integer machineAttributeId) {
        this.id = id;
        this.attributeValueYear = attributeValueYear;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = "";
    }

    public AttributeValueDto(Integer id, int year, Integer machineAttributeId, String attributeValue) {
        this.id = id;
        this.attributeValueYear = year;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = attributeValue;
    }
}