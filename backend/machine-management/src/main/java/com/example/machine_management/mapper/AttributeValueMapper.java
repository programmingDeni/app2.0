package com.example.machine_management.mapper;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.MachineAttribute;

public class AttributeValueMapper {

    public static AttributeValueDto toDto(AttributeValue attributeValue) {
        return new AttributeValueDto(attributeValue.getId(), attributeValue.getAttributeValueYear(),
                attributeValue.getMachineAttribute().getId(), attributeValue.getAttributeValue(),
                attributeValue.getZuletztGeprueft(),
                attributeValue.getZuletztGetauscht());
    }

    public static AttributeValue toEntity(AttributeValueDto dto, MachineAttribute machineAttribute) {
        AttributeValue val = new AttributeValue(machineAttribute, dto.attributeValueYear, dto.attributeValue,
                dto.zuletztGeprueft, dto.zuletztGetauscht);
        return val;
    }

}
