package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.models.Machine;

public class MachineStructureMapper {

    public static MachineStructureDto toDto(Machine machine) {
        
        return new MachineStructureDto(
            machine.getId(),
            machine.getName(),
            machine.getTemplate() != null ? machine.getTemplate().getId() : null,
            MachineAttributeMapper.toDtoList(machine.getAttributes())
        );
    }
    
}
