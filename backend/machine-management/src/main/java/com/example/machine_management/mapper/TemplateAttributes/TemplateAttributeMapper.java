package com.example.machine_management.mapper.TemplateAttributes;

import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.sql.Template;
import org.springframework.stereotype.Component;

import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.TemplateAttribute;

@Component
public class TemplateAttributeMapper implements EntityMapper<TemplateAttribute, TemplateAttributeDto> {

    @Override
    public TemplateAttributeDto toDto(TemplateAttribute attr) {
        TemplateAttributeDto dto = new TemplateAttributeDto();
        dto.id = attr.getId();
        dto.attributeName = attr.getAttributeInTemplateName();
        dto.attributeType = attr.getType();
        return dto;
    }

    @Override
    public TemplateAttribute fromDto(TemplateAttributeDto dto) {
        TemplateAttribute attr = new TemplateAttribute();
        attr.setAttributeInTemplateName(dto.attributeName);
        attr.setType(dto.attributeType);
        return attr;
    }

    public List<TemplateAttributeDto> toDtoList(List<TemplateAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /*
     * LEGACY
     * public static TemplateAttributeDto toDto(TemplateAttribute attr) {
     * TemplateAttributeDto dto = new TemplateAttributeDto();
     * dto.id = attr.getId();
     * dto.attributeName = attr.getAttributeInTemplateName();
     * dto.attributeType = attr.getType();
     * return dto;
     * }
     */

}
