package com.example.machine_management.mapper;

import java.util.stream.Collectors;
import java.util.List;

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
            attr.getAttributeValues().stream()
                .map(AttributeValueMapper::toDto)
                .collect(Collectors.toList()),
            attr.getMachine().getId()
        );
    }

    public static List<MachineAttributeDto> toDtoList(List<MachineAttribute> attributes) {
        if (attributes == null) return null;
        return attributes.stream()
            .map(MachineAttributeMapper::toDto)
            .collect(Collectors.toList());
    }

    public static MachineAttribute toEntity(MachineAttributeDto machineAttributeDto, Machine machine) {
        MachineAttribute attr = new MachineAttribute(machine, machineAttributeDto.attributeName);
        //attr.setId(dto.id);
        attr.setType(AttributeType.valueOf(machineAttributeDto.attributeType)); // <-- hier Umwandlung String → Enum

        if(machineAttributeDto.attributeValues != null) {
            attr.setAttributeValues(machineAttributeDto.attributeValues.stream()
                .map(val -> AttributeValueMapper.toEntity(val, attr))
                .collect(Collectors.toList()));
        }

        return attr;
    }
}
