package com.example.machine_management.dto.MachineAttributes;

import java.util.List;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;

public class MachineAttributeDto {

    public Integer id;
    public String attributeName;
    public String attributeType; // wenn du das Enum als String nutzen willst
    public List<AttributeValueDto> attributeValues;
    public int machineId;
    public boolean fromTemplate;
    public Integer pruefungsIntervall;

    public MachineAttributeDto() {
    }

    public MachineAttributeDto(Integer id, String attributeName, String attributeType,
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
