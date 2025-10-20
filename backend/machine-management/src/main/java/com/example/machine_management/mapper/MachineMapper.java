package com.example.machine_management.mapper;

import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;

import org.springframework.stereotype.Component;

@Component
public class MachineMapper implements EntityMapper<Machine, MachineDto> {

    @Override
    public Machine fromDto(MachineDto dto) {
        if (dto.machineName == null || dto.machineName.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = new Machine(dto.machineName);
        if (dto.attributes != null) {
            for (MachineAttributeDto attrDto : dto.attributes) {
                MachineAttribute attr = MachineAttributeMapper.toEntity(attrDto, dto.id);
                machine.addAttribute(attr);
            }
        }
        return machine;
    }

    @Override
    public MachineDto toDto(Machine machine) {
        MachineTemplateDto templateDto = machine.getMachineTemplate() != null
                ? MachineTemplateMapper.toDto(machine.getMachineTemplate())
                : null;

        return new MachineDto(
                machine.getId(),
                machine.getMachineName(),
                MachineAttributeMapper.toDtoListLazy(machine.getMachineAttributes()),
                templateDto);
    }

    /**
     * Erstellt neue Machine aus Template.
     * Helper-Methode für createMachineFromTemplate.
     */
    public Machine fromTemplate(String name, MachineTemplate template) {
        Machine machine = new Machine(name);
        machine.setMachineTemplate(template);
        return machine;
    }

}
