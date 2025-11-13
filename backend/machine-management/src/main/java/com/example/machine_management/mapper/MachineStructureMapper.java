package com.example.machine_management.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.models.machine.Machine;

@Component
public class MachineStructureMapper {

    private final MachineAttributeMapper machineAttributeMapper;

    @Autowired
    public MachineStructureMapper(MachineAttributeMapper machineAttributeMapper) {
        this.machineAttributeMapper = machineAttributeMapper;
    }

    public MachineStructureDto toDto(Machine machine) {

        return new MachineStructureDto(
                machine.getId(),
                machine.getMachineName(),
                machine.getMachineTemplate() != null ? machine.getMachineTemplate().getId() : null,
                machineAttributeMapper.toDtoListEager(machine.getMachineAttributes()));
    }

}
