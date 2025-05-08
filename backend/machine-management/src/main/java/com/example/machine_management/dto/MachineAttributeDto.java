package com.example.machine_management.dto;

public class MachineAttributeDto {

    public int id;
    public String attributeName;
    public String attributeType; // wenn du das Enum als String nutzen willst
    public String attributeValue;
    public int machineId;
    

    public MachineAttributeDto() {}

    public MachineAttributeDto(int id, String attributeName, String attributeType, String attributValue,int machineId) {
        this.id = id;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributValue;
        this.machineId = machineId;
    }
}
