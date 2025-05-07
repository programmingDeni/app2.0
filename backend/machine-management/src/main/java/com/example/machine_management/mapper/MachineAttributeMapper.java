package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttributes;
import com.example.machine_management.models.AttributeType;

public class MachineAttributeMapper {

    public static MachineAttributeDto toDto(MachineAttributes attr) {
        return new MachineAttributeDto(
            attr.getId(),
            attr.getAttributeName(),
            attr.getType().toString(),
            attr.getMachine().getId()
        );
    }

    public static MachineAttributes toEntity(MachineAttributeDto dto, Machine machine) {
        MachineAttributes attr = new MachineAttributes();
        //attr.setId(dto.id);
        attr.setAttributeName(dto.attributeName);
        attr.setType(AttributeType.valueOf(dto.attributeType)); // <-- hier Umwandlung String → Enum
        attr.setMachine(machine);
        return attr;
    }
}
