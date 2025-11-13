package com.example.machine_management.mapper;

import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MachineMapper implements EntityMapper<Machine, MachineDto> {

    private final MachineTemplateMapper machineTemplateMapper;
    private final MachineAttributeMapper machineAttributeMapper;

    @Autowired
    public MachineMapper(
            MachineTemplateMapper machineTemplateMapper,
            MachineAttributeMapper machineAttributeMapper) {
        this.machineTemplateMapper = machineTemplateMapper;
        this.machineAttributeMapper = machineAttributeMapper;
    }

    @Override
    public Machine fromDto(MachineDto dto) {
        if (dto.machineName == null || dto.machineName.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = new Machine(dto.machineName);
        if (dto.attributes != null) {
            for (MachineAttributeDto attrDto : dto.attributes) {
                MachineAttribute attr = machineAttributeMapper.toEntity(attrDto, dto.id);
                machine.addAttribute(attr);
            }
        }
        return machine;
    }

    @Override
    public MachineDto toDto(Machine machine) {
        MachineTemplateDto templateDto = machine.getMachineTemplate() != null
                ? machineTemplateMapper.toDto(machine.getMachineTemplate())
                : null;

        return new MachineDto(
                machine.getId(),
                machine.getMachineName(),
                machineAttributeMapper.toDtoListLazy(machine.getMachineAttributes()),
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

    @Override
    public List<MachineDto> toDtoList(List<Machine> entities) {
        return entities.stream().map(this::toDto).toList();
    }

}
