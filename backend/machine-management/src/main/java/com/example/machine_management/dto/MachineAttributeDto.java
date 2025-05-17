package com.example.machine_management.dto;

import java.util.List;


public class MachineAttributeDto {

    public int id;
    public String attributeName;
    public String attributeType; // wenn du das Enum als String nutzen willst
    public List<AttributeValueDto> attributeValues;
    public int machineId;
    

    public MachineAttributeDto() {}

    public MachineAttributeDto(int id, String attributeName, String attributeType,
     List<AttributeValueDto> attributeValues, Integer machineId) {
        this.id = id;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValues = attributeValues;
        this.machineId = machineId;
    }

}
