package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.models.Machine;

public class MachineStructureMapper {

    public static MachineStructureDto toDto(Machine machine) {

        return new MachineStructureDto(
                machine.getId(),
                machine.getMachineName(),
                machine.getMachineTemplate() != null ? machine.getMachineTemplate().getId() : null,
                MachineAttributeMapper.toDtoListEager(machine.getMachineAttributes()));
    }

}
