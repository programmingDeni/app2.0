package com.example.machine_management.mapper;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;

public class MachineAttributeMapper {

    public static MachineAttributeDto toDto(MachineAttribute attr) {
        return new MachineAttributeDto(
            attr.getId(),
            attr.getAttributeName(),
            attr.getType().toString(),
            attr.getAttributeValue(),
            attr.getMachine().getId()
        );
    }

    public static MachineAttribute toEntity(MachineAttributeDto dto, Machine machine) {
        MachineAttribute attr = new MachineAttribute(machine, dto.attributeName);
        //attr.setId(dto.id);
        attr.setType(AttributeType.valueOf(dto.attributeType)); // <-- hier Umwandlung String → Enum
        attr.setAttributeValue(dto.attributeValue);
        return attr;
    }
}
