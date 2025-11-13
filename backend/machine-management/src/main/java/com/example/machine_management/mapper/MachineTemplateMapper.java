package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.mapper.TemplateAttributes.TemplateAttributeMapper;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class MachineTemplateMapper implements EntityMapper<MachineTemplate, MachineTemplateDto> {

    private final TemplateAttributeMapper templateAttributeMapper;

    public MachineTemplateMapper(TemplateAttributeMapper templateAttributeMapper) {
        this.templateAttributeMapper = templateAttributeMapper;
    }

    @Override
    public MachineTemplateDto toDto(MachineTemplate template) {
        MachineTemplateDto dto = new MachineTemplateDto();
        dto.id = template.getId();
        dto.templateName = template.getTemplateName();
        dto.templateAttributes = templateAttributeMapper.toDtoList(template.getTemplateAttributes());
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
        withAttributesDto.attributeTemplates = templateAttributeMapper
                .toDtoList(machineTemplate.getTemplateAttributes());
        return withAttributesDto;
    }

    @Override
    public List<MachineTemplateDto> toDtoList(List<MachineTemplate> entities) {
        return entities.stream().map(this::toDto).toList();
    }

}