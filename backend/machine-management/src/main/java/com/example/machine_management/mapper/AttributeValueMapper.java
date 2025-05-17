package com.example.machine_management.mapper;

import com.example.machine_management.dto.AttributeValueDto;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.MachineAttribute;

public class AttributeValueMapper {
    
    public static AttributeValueDto toDto(AttributeValue attributeValue) {
        return new AttributeValueDto(attributeValue.getId(), attributeValue.getYear(), attributeValue.getMachineAttribute().getId(), attributeValue.getAttributeValue());
    }

    public static AttributeValue toEntity(AttributeValueDto dto, MachineAttribute machineAttribute) {
        AttributeValue val = new AttributeValue(machineAttribute, dto.year,dto.attributeValue);
        return val;
    }
    
}
