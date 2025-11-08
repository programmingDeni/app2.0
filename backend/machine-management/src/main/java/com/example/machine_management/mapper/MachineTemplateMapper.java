package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.TemplateAttribute;
import com.example.machine_management.models.MachineTemplate;

import org.springframework.stereotype.Component;

@Component
public class MachineTemplateMapper implements EntityMapper<MachineTemplate, MachineTemplateDto> {

    private final AttributeTemplateMapper attributeTemplateMapper;

    public MachineTemplateMapper(AttributeTemplateMapper attributeTemplateMapper) {
        this.attributeTemplateMapper = attributeTemplateMapper;
    }

    @Override
    public MachineTemplateDto toDto(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        dto.templateAttributes = attributeTemplateMapper.toDtoList(template.getAttributeTemplates());
        return dto;
    }

    @Override
    public MachineTemplate fromDto(MachineTemplateDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName);
        return template;
    }

    public MachineTemplateDto toDtoLazy(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        return dto;
    }

    public CreateMachineTemplateWithAttributesDto toWithAttributesDto(MachineTemplate machineTemplate) {
        CreateMachineTemplateWithAttributesDto withAttributesDto = new CreateMachineTemplateWithAttributesDto();
        withAttributesDto.templateName = machineTemplate.getTemplateName();
        withAttributesDto.attributeTemplates = attributeTemplateMapper
                .toDtoList(machineTemplate.getAttributeTemplates());
        return withAttributesDto;
    }

}