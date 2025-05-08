// MachineTemplateMapper.java
package com.example.machine_management.mapper;

import com.example.machine_management.dto.*;
import com.example.machine_management.models.*;

import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.List;

public class MachineTemplateMapper {

    public static MachineTemplateDto toDto(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        dto.attributeTemplates = template.getAttributeTemplates().stream()
            .map(AttributeTemplateMapper::toDto)
            .collect(Collectors.toList());
        return dto;
    }

    public static MachineTemplate fromDto(MachineTemplateDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName);

        System.out.println("Dto erhalten: " + dto.templateName + ", " + dto.attributeTemplates);
        for (AttributeTemplateDto attrDto : dto.attributeTemplates) {
            System.out.println("Attribut empfangen: " + attrDto.attributeInTemplateName + ", Typ: " + attrDto.attributeInTemplateType); 
        }
        

        List<AttributeInTemplate> attributeTemplates = dto.attributeTemplates.stream()
            .map(attrDto -> {
                System.out.println("attrDto erhalten: " + attrDto.attributeInTemplateName + ", " + attrDto.attributeInTemplateType);
                AttributeInTemplate attr = new AttributeInTemplate();
                attr.setAttributeInTemplateName(attrDto.attributeInTemplateName);
                attr.setType(AttributeType.valueOf(attrDto.attributeInTemplateType));
                attr.setMachineTemplate(template);
                return attr;
            })
            .collect(Collectors.toList());

        System.out.println("Attribute erstellt: " + attributeTemplates);

        template.setAttributeTemplates(attributeTemplates);
        return template;
    }
}
