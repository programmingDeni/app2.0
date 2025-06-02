package com.example.machine_management.dto;

import java.util.List;

public class MachineStructureDto {
    public Integer id;
    public String name;
    public Integer machineTemplateId;
    public List<MachineAttributeDto> machineAttributes;

    public MachineStructureDto() {}

    public MachineStructureDto(Integer id, String name, Integer machineTemplateId, List<MachineAttributeDto> attributes) {
        this.id = id;
        this.name = name;
        this.machineTemplateId = machineTemplateId;
        this.machineAttributes = attributes;
    }

    
}
