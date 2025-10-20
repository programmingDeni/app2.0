package com.example.machine_management.mapper;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.models.AttributeType;

public class MachineAttributeMapper {

    public static MachineAttributeDto toDtoEager(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getType().toString(),
                attr.getAttributeValues().stream()
                        .map(AttributeValueMapper::toDto)
                        .collect(Collectors.toList()),
                attr.getMachineId(),
                attr.isFromTemplate(),
                attr.getPruefungsIntervall());
    }

    public static MachineAttributeDto toDtoLazy(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getType().toString(),
                new ArrayList<>(),
                attr.getMachineId(),
                attr.isFromTemplate(),
                attr.getPruefungsIntervall());
    }

    public static List<MachineAttributeDto> toDtoListLazy(List<MachineAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(MachineAttributeMapper::toDtoLazy)
                .collect(Collectors.toList());
    }

    public static List<MachineAttributeDto> toDtoListEager(List<MachineAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(MachineAttributeMapper::toDtoEager)
                .collect(Collectors.toList());
    }

    public static MachineAttribute toEntity(MachineAttributeDto machineAttributeDto, Integer machineId) {
        MachineAttribute attr = new MachineAttribute(machineId, machineAttributeDto.id);
        // attr.setId(dto.id);
        attr.setType(AttributeType.valueOf(machineAttributeDto.attributeType)); // <-- hier Umwandlung String → Enum

        if (machineAttributeDto.attributeValues != null) {
            attr.setAttributeValues(machineAttributeDto.attributeValues.stream()
                    .map(val -> AttributeValueMapper.toEntity(val, attr))
                    .collect(Collectors.toList()));
        }

        return attr;
    }
}
