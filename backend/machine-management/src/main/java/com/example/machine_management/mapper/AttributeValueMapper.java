package com.example.machine_management.mapper;

import org.springframework.stereotype.Component;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.MachineAttribute;

@Component
public class AttributeValueMapper implements EntityMapper<AttributeValue, AttributeValueDto> {

    @Override
    public AttributeValueDto toDto(AttributeValue attributeValue) {
        return new AttributeValueDto(attributeValue.getId(), attributeValue.getAttributeValueYear(),
                attributeValue.getMachineAttribute().getId(), attributeValue.getAttributeValue(),
                attributeValue.getZuletztGeprueft(),
                attributeValue.getZuletztGetauscht());
    }

    @Override
    public AttributeValue fromDto(AttributeValueDto dto) {
        // Note: This method requires a MachineAttribute to be set later
        // Use toEntity(dto, machineAttribute) helper method instead
        throw new UnsupportedOperationException(
                "Use toEntity(AttributeValueDto dto, MachineAttribute machineAttribute) instead");
    }

    // Helper method that requires MachineAttribute
    public AttributeValue toEntity(AttributeValueDto dto, MachineAttribute machineAttribute) {
        AttributeValue val = new AttributeValue(machineAttribute, dto.attributeValueYear, dto.attributeValue,
                dto.zuletztGeprueft, dto.zuletztGetauscht);
        return val;
    }

}
