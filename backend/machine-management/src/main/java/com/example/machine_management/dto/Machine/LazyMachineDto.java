package com.example.machine_management.dto.Machine;

public class LazyMachineDto {
    public Integer machineId;
    public String machineName;
    public String templateName;

    public LazyMachineDto() {
    }

    public LazyMachineDto(Integer machineId, String machineName, String templateName) {
        this.machineId = machineId;
        this.machineName = machineName;
        this.templateName = templateName;
    }

}
