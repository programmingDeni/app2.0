// MachineTemplateDto.java
package com.example.machine_management.dto.MachineTemplates;

import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;

public class MachineTemplateDto {
    public Integer id;
    public String templateName;

    public List<TemplateAttributeDto> templateAttributes;

    public MachineTemplateDto() {
    }

    public MachineTemplateDto(String templateName){
        this.templateName=templateName;
        this.templateAttributes = new ArrayList<TemplateAttributeDto>();
    }

    public MachineTemplateDto(Integer id, String templateName, List<TemplateAttributeDto> templateAttributes) {
        this.id = id;
        this.templateName = templateName;
        this.templateAttributes = templateAttributes;
    }

}
