package com.example.machine_management.mapper;

import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;

import java.util.stream.Collectors;

public class MachineMapper {

    public static MachineDto toDto(Machine machine) {
        MachineTemplateDto templateDto = machine.getMachineTemplate() != null
                ? MachineTemplateMapper.toDto(machine.getMachineTemplate())
                : null;

        return new MachineDto(
                machine.getId(),
                machine.getMachineName(),
                MachineAttributeMapper.toDtoList(machine.getMachineAttributes()),
                templateDto);
    }

    // Nur falls du auch Entities aus Dtos erstellen willst (z. B. beim POST):
    public static Machine fromDto(MachineDto dto) {
        Machine machine = new Machine(dto.name);
        if (dto.attributes != null) {
            for (MachineAttributeDto attrDto : dto.attributes) {
                MachineAttribute attr = MachineAttributeMapper.toEntity(attrDto, machine);
                machine.addAttribute(attr); // bidirektional
            }
        }
        return machine;
    }

    public static Machine fromTemplate(String name, MachineTemplate template) {
        Machine machine = new Machine(name);
        machine.setMachineTemplate(template);

        for (AttributeInTemplate t : template.getAttributeTemplates()) {
            MachineAttribute attr = new MachineAttribute(machine, t.getAttributeInTemplateName());
            attr.setType(t.getType());
            machine.addAttribute(attr);
        }

        return machine;
    }

}
