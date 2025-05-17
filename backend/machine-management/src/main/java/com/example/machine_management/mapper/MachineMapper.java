package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.dto.MachineDto;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;

import java.util.stream.Collectors;

public class MachineMapper {

    public static MachineDto toDto(Machine machine) {
        return new MachineDto(
            machine.getId(),
            machine.getName(),
            machine.getAttributes().stream()
                .map(MachineAttributeMapper::toDto)
                .collect(Collectors.toList())
        );
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
    machine.setTemplate(template);

    for (AttributeInTemplate t : template.getAttributeTemplates()) {
        MachineAttribute attr = new MachineAttribute(machine, t.getAttributeInTemplateName());
        attr.setType(t.getType());
        machine.addAttribute(attr);
    }

        return machine;
    }

}
