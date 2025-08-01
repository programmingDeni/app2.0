// MachineTemplateDto.java
package com.example.machine_management.dto.MachineTemplates;

import java.util.List;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.models.Machine;

public class MachineTemplateDto {
    public Integer id;
    public String templateName;

    public List<AttributeTemplateDto> templateAttributes;

    public MachineTemplateDto() {
    }

    public MachineTemplateDto(Integer id, String templateName, List<AttributeTemplateDto> templateAttributes) {
        this.id = id;
        this.templateName = templateName;
        this.templateAttributes = templateAttributes;
    }

}
