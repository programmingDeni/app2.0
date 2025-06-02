package com.example.machine_management.dto;

import java.util.List;

public class CreateMachineTemplateWithAttributesDto {

    public String templateName;

    public List<AttributeTemplateDto> attributeTemplates;

    public CreateMachineTemplateWithAttributesDto() {}

    public CreateMachineTemplateWithAttributesDto(String templateName, List<AttributeTemplateDto> attributeTemplates) {
        this.templateName = templateName;
        this.attributeTemplates = attributeTemplates;
    }
    
}