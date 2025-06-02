// AttributeTemplateMapper.java
package com.example.machine_management.mapper;

import java.text.AttributedCharacterIterator.Attribute;
import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.dto.*;
import com.example.machine_management.models.*;

public class AttributeTemplateMapper {

    public static AttributeTemplateDto toDto(AttributeInTemplate attr) {
        AttributeTemplateDto dto = new AttributeTemplateDto();
        dto.id = attr.getId();
        dto.attributeInTemplateName = attr.getAttributeInTemplateName();
        dto.attributeInTemplateType = attr.getType().toString();
        return dto;
    }

    public static List<AttributeTemplateDto> toDtoList(List<AttributeInTemplate> attributes) {
        if(attributes == null) {
            return new ArrayList<>();
        }
        List<AttributeTemplateDto> dtos = new ArrayList<>();
        for (AttributeInTemplate attribute : attributes) {
            dtos.add(toDto(attribute));
        }
        return dtos;
    }

    public static AttributeInTemplate fromDto(AttributeTemplateDto dto, MachineTemplate template) {
        //String name, AttributeType type, MachineTemplate template
        AttributeInTemplate attr = new AttributeInTemplate(dto.attributeInTemplateName,
         AttributeType.valueOf(dto.attributeInTemplateType), template);

        return attr;
    }

    public static List<AttributeInTemplate> fromDtoList(List<AttributeTemplateDto> attributes, MachineTemplate template) {
        List<AttributeInTemplate> dtos = new ArrayList<>();
        for (AttributeTemplateDto attribute : attributes) {
            dtos.add(fromDto(attribute,template));
        }
        return dtos;
    }

    public static void updateFromDto(AttributeInTemplate attributeInTemplate, AttributeTemplateDto dto) {
        attributeInTemplate.setAttributeInTemplateName(dto.attributeInTemplateName);
        attributeInTemplate.setType(AttributeType.valueOf(dto.attributeInTemplateType));
    }

}
