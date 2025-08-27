package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.MachineTemplate;

public class MachineTemplateMapper {

    public static MachineTemplateDto toDto(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        dto.templateAttributes = AttributeTemplateMapper.toDtoList(template.getAttributeTemplates());
        return dto;
    }

    public static MachineTemplateDto toDtoLazy(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        return dto;
    }

    public static MachineTemplate fromDto(MachineTemplateDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName);
        return template;
    }

    public static CreateMachineTemplateWithAttributesDto toWithAttributesDto(MachineTemplate machineTemplate) {
        CreateMachineTemplateWithAttributesDto withAttributesDto = new CreateMachineTemplateWithAttributesDto();
        withAttributesDto.templateName = machineTemplate.getTemplateName();
        withAttributesDto.attributeTemplates = AttributeTemplateMapper
                .toDtoList(machineTemplate.getAttributeTemplates());
        return withAttributesDto;
    }

}