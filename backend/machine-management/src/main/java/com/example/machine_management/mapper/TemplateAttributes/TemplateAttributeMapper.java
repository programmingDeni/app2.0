package com.example.machine_management.mapper.TemplateAttributes;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.template.TemplateAttribute;

@Component
public class TemplateAttributeMapper implements EntityMapper<TemplateAttribute, TemplateAttributeDto> {

    @Override
    public TemplateAttributeDto toDto(TemplateAttribute attr) {
        TemplateAttributeDto dto = new TemplateAttributeDto();
        dto.id = attr.getId();
        dto.templateAttributeName = attr.getAttributeInTemplateName();
        dto.templateAttributeType = attr.getType();
        return dto;
    }

    @Override
    public TemplateAttribute fromDto(TemplateAttributeDto dto) {
        TemplateAttribute attr = new TemplateAttribute();
        attr.setAttributeInTemplateName(dto.templateAttributeName);
        attr.setType(dto.templateAttributeType);
        return attr;
    }

    public List<TemplateAttributeDto> toDtoList(List<TemplateAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TemplateAttribute> fromDtoList(List<TemplateAttributeDto> templateAttributeDtos){
        if(templateAttributeDtos == null)
            return null;
        else{
            return templateAttributeDtos.stream()
                        .map(this::fromDto)
                        .collect(Collectors.toList());
        }
    }

}
