package com.example.machine_management.mapper.TemplateAttributes;

import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.models.AttributeInTemplate;

public class TemplateAttributeMapper {

    public static TemplateAttributeDto toDto(AttributeInTemplate attr) {
        TemplateAttributeDto dto = new TemplateAttributeDto();
        dto.attributeId = attr.getId();
        dto.attributeName = attr.getAttributeInTemplateName();
        dto.attributeType = attr.getType();
        return dto;
    }

}
