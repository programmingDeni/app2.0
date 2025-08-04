package com.example.machine_management.dto.Machine;

import java.util.List;

import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.Machine;

public class MachineDto {

    public int id;
    public String name;
    public List<MachineAttributeDto> attributes;
    public MachineTemplateDto machineTemplateDto;

    public MachineDto() {
    }

    public MachineDto(int id, String name, List<MachineAttributeDto> machineAttributeDtos,
            MachineTemplateDto machineTemplate) {
        this.id = id;
        this.name = name;
        this.attributes = attributes;
        this.machineTemplateDto = machineTemplate;
    }
}
