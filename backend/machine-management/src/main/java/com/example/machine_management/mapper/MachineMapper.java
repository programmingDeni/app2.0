package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineDto;
import com.example.machine_management.models.Machine;
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
        //machine.setId(dto.id); // setter ggf. freischalten
        // Du kannst hier auch Attribute hinzufügen, falls nötig
        return machine;
    }
}
