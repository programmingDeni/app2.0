package com.example.machine_management.mapper;

import java.util.stream.Collectors;

import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.mapper.AttributeTemplateMapper;

public class CreateMachineTemplateWithAttributes {

    public static CreateMachineTemplateWithAttributesDto toDto(CreateMachineTemplateWithAttributesDto dto) {
        return new CreateMachineTemplateWithAttributesDto(
                dto.templateName,
                dto.attributeTemplates.stream()
                        // .map(AttributeTemplateMapper::toDto)
                        .collect(Collectors.toList()));
    }

}
