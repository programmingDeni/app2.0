package com.example.machine_management.dto;

import java.util.List;

import com.example.machine_management.models.Machine;

public class MachineDto {

    public int id;
    public String name;
    public List<MachineAttributeDto> attributes;
    public MachineTemplateDto machineTemplateDto;

    public MachineDto() {}

    public MachineDto(int id, String name, List<MachineAttributeDto> attributes, MachineTemplateDto machineTemplateDto) {
        this.id = id;
        this.name = name;
        this.attributes = attributes;
        this.machineTemplateDto = machineTemplateDto;
    }
}
