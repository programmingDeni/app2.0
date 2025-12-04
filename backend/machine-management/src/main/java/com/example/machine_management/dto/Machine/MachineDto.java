package com.example.machine_management.dto.Machine;

import java.util.List;

import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.machine.Machine;

public class MachineDto {

    public Integer id;
    public String machineName;
    public List<MachineAttributeDto> attributes;
    public MachineTemplateDto machineTemplateDto;

    public MachineDto() {
    }

    public MachineDto(Integer id, String machineName, List<MachineAttributeDto> machineAttributeDtos,
            MachineTemplateDto machineTemplate) {
        this.id = id;
        this.machineName = machineName;
        this.attributes = machineAttributeDtos;
        this.machineTemplateDto = machineTemplate;
    }
}
