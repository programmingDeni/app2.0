package com.example.machine_management.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.dto.LazyMachineDto;
import com.example.machine_management.models.Machine;

public class LazyMachineMapper {

    public static LazyMachineDto toDto(Machine machine) {
        return new LazyMachineDto(
            machine.getId(),
            machine.getName(),
            machine.getTemplate() != null ? machine.getTemplate().getTemplateName() : null
        );
    }

    public static List<LazyMachineDto> toDtoList(List<Machine> machines) {
        if (machines == null) return null;
        return machines.stream()
            .map(LazyMachineMapper::toDto)
            .collect(Collectors.toList());
    }    
}
