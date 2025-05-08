// MachineTemplateDto.java
package com.example.machine_management.dto;

import java.util.List;

public class MachineTemplateDto {
    public Integer id;
    public String templateName;
    public List<AttributeTemplateDto> attributeTemplates;

    public MachineTemplateDto() {}

    public MachineTemplateDto(Integer id, String templateName, List<AttributeTemplateDto> attributeTemplates) {
        this.id = id;
        this.templateName = templateName;
        this.attributeTemplates = attributeTemplates;
    }
}
