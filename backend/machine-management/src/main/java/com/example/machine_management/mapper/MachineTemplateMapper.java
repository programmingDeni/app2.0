package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineTemplateDto;
import com.example.machine_management.models.MachineTemplate;

public class MachineTemplateMapper {

    public static MachineTemplateDto toDto(MachineTemplate template) {
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
}