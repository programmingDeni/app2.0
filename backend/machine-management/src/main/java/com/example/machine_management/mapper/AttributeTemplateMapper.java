// AttributeTemplateMapper.java
package com.example.machine_management.mapper;

import java.text.AttributedCharacterIterator.Attribute;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.machine_management.dto.*;
import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.models.*;

@Component
public class AttributeTemplateMapper implements EntityMapper<TemplateAttribute, AttributeTemplateDto> {

    @Override
    public AttributeTemplateDto toDto(TemplateAttribute attr) {
        AttributeTemplateDto dto = new AttributeTemplateDto();
        dto.id = attr.getId();
        dto.templateAttributeName = attr.getAttributeInTemplateName();
        dto.templateAttributeType = attr.getType().toString();
        dto.machineTemplateId = attr.getMachineTemplate().getId();
        return dto;
    }

    @Override
    public TemplateAttribute fromDto(AttributeTemplateDto dto) {
        // Note: This method requires a MachineTemplate to be set
        // Use fromDto(dto, template) helper method instead
        throw new UnsupportedOperationException(
                "Use fromDto(AttributeTemplateDto dto, MachineTemplate template) instead");
    }

    // Helper methods
    public List<AttributeTemplateDto> toDtoList(List<TemplateAttribute> attributes) {
        if (attributes == null) {
            return new ArrayList<>();
        }
        List<AttributeTemplateDto> dtos = new ArrayList<>();
        for (TemplateAttribute attribute : attributes) {
            dtos.add(toDto(attribute));
        }
        return dtos;
    }

    public TemplateAttribute fromDto(AttributeTemplateDto dto, MachineTemplate template) {
        // String name, AttributeType type, MachineTemplate template
        TemplateAttribute attr = new TemplateAttribute(dto.templateAttributeName,
                AttributeType.valueOf(dto.templateAttributeType), template);

        return attr;
    }

    public List<TemplateAttribute> fromDtoList(List<AttributeTemplateDto> attributes,
            MachineTemplate template) {
        List<TemplateAttribute> dtos = new ArrayList<>();
        for (AttributeTemplateDto attribute : attributes) {
            dtos.add(fromDto(attribute, template));
        }
        return dtos;
    }

    public void updateFromDto(TemplateAttribute attributeInTemplate, AttributeTemplateDto dto) {
        attributeInTemplate.setAttributeInTemplateName(dto.templateAttributeName);
        attributeInTemplate.setType(AttributeType.valueOf(dto.templateAttributeType));
    }

}
