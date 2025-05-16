// MachineTemplateDto.java
package com.example.machine_management.dto;

import java.util.List;

public class MachineTemplateDto {
    public Integer id;
    public String templateName;

    public MachineTemplateDto() {}

    public MachineTemplateDto(Integer id, String templateName) {
        this.id = id;
        this.templateName = templateName;
    }

    
}
