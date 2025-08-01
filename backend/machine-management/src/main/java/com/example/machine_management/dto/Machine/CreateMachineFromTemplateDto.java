package com.example.machine_management.dto.Machine;

public class CreateMachineFromTemplateDto {

    public String machineName;
    public Integer machineTemplateId;

    public CreateMachineFromTemplateDto() {
    }

    public CreateMachineFromTemplateDto(String machineName, Integer machineTemplateId) {
        this.machineName = machineName;
        this.machineTemplateId = machineTemplateId;
    }

}
