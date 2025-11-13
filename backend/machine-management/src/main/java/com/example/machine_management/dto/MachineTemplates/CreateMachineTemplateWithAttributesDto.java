package com.example.machine_management.dto.MachineTemplates;

import java.util.List;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;

public class CreateMachineTemplateWithAttributesDto {

    public String templateName;

    public List<TemplateAttributeDto> attributeTemplates;

    public CreateMachineTemplateWithAttributesDto() {
    }

    public CreateMachineTemplateWithAttributesDto(String templateName, List<TemplateAttributeDto> attributeTemplates) {
        this.templateName = templateName;
        this.attributeTemplates = attributeTemplates;
    }

}