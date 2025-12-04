package com.example.machine_management.dto.MachineAttributes;

import java.util.List;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.models.enums.AttributeType;

public class MachineAttributeDto {

    public Integer id;
    public String attributeName;
    public AttributeType attributeType; // wenn du das Enum als String nutzen willst
    public List<AttributeValueDto> attributeValues;
    public int machineId;
    public boolean fromTemplate;
    public Integer pruefungsIntervall;

    public MachineAttributeDto() {
    }

    //minimal constructor fuers create
    public MachineAttributeDto(String attributeName, AttributeType attributeType, Integer machineId){
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.machineId = machineId; 
    }

    public MachineAttributeDto(Integer id, String attributeName, AttributeType attributeType,
            List<AttributeValueDto> attributeValues, Integer machineId, boolean fromTemplate,
            Integer pruefungsIntervall) {
        this.id = id;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValues = attributeValues;
        this.machineId = machineId;
        this.fromTemplate = fromTemplate;
        this.pruefungsIntervall = pruefungsIntervall;
    }

}
