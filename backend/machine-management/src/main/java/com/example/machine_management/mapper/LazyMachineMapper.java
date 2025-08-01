package com.example.machine_management.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.models.Machine;

public class LazyMachineMapper {

    public static LazyMachineDto toDto(Machine machine) {
        return new LazyMachineDto(
                machine.getId(),
                machine.getMachineName(),
                machine.getMachineTemplate() != null ? machine.getMachineTemplate().getTemplateName() : null);
    }

    public static List<LazyMachineDto> toDtoList(List<Machine> machines) {
        if (machines == null)
            return null;
        return machines.stream()
                .map(LazyMachineMapper::toDto)
                .collect(Collectors.toList());
    }
}
