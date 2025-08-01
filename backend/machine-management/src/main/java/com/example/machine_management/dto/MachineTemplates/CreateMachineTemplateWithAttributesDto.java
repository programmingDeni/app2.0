package com.example.machine_management.dto.MachineTemplates;

import java.util.List;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;

public class CreateMachineTemplateWithAttributesDto {

    public String templateName;

    public List<AttributeTemplateDto> attributeTemplates;

    public CreateMachineTemplateWithAttributesDto() {
    }

    public CreateMachineTemplateWithAttributesDto(String templateName, List<AttributeTemplateDto> attributeTemplates) {
        this.templateName = templateName;
        this.attributeTemplates = attributeTemplates;
    }

}