package com.example.machine_management.dto;

public class CreateMachineFromTemplateDto {

    public String machineName;
    public Integer templateId;

    public CreateMachineFromTemplateDto() {}

    public CreateMachineFromTemplateDto(String machineName, Integer templateId) {
        this.machineName = machineName;
        this.templateId = templateId;
    }
    
}
