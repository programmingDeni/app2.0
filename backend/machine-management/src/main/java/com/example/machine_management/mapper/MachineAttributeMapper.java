package com.example.machine_management.mapper;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.models.AttributeType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MachineAttributeMapper implements EntityMapper<MachineAttribute, MachineAttributeDto> {

    private final AttributeValueMapper attributeValueMapper;

    @Autowired
    public MachineAttributeMapper(AttributeValueMapper attrributeValueMapper) {
        this.attributeValueMapper = attrributeValueMapper;
    }

    @Override
    public MachineAttributeDto toDto(MachineAttribute attr) {
        return toDtoEager(attr);
    }

    @Override
    public MachineAttribute fromDto(MachineAttributeDto dto) {
        // Für GenericCrudService - machineId wird später gesetzt
        MachineAttribute attr = new MachineAttribute();
        attr.setAttributeName(dto.attributeName);
        attr.setType(AttributeType.valueOf(dto.attributeType));
        attr.setPruefungsIntervall(dto.pruefungsIntervall);
        return attr;
    }

    public MachineAttributeDto toDtoEager(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getType().toString(),
                attr.getAttributeValues().stream()
                        .map(attributeValueMapper::toDto)
                        .collect(Collectors.toList()),
                attr.getMachineId(),
                attr.isFromTemplate(),
                attr.getPruefungsIntervall());
    }

    public MachineAttributeDto toDtoLazy(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getType().toString(),
                new ArrayList<>(),
                attr.getMachineId(),
                attr.isFromTemplate(),
                attr.getPruefungsIntervall());
    }

    public List<MachineAttributeDto> toDtoListLazy(List<MachineAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(this::toDtoLazy)
                .collect(Collectors.toList());
    }

    public List<MachineAttributeDto> toDtoListEager(List<MachineAttribute> attributes) {
        if (attributes == null)
            return null;
        return attributes.stream()
                .map(this::toDtoEager)
                .collect(Collectors.toList());
    }

    public MachineAttribute toEntity(MachineAttributeDto machineAttributeDto, Integer machineId) {
        MachineAttribute attr = new MachineAttribute(machineId, machineAttributeDto.id);
        // attr.setId(dto.id);
        attr.setType(AttributeType.valueOf(machineAttributeDto.attributeType)); // <-- hier Umwandlung String → Enum

        if (machineAttributeDto.attributeValues != null) {
            attr.setAttributeValues(machineAttributeDto.attributeValues.stream()
                    .map(val -> attributeValueMapper.toEntity(val, attr))
                    .collect(Collectors.toList()));
        }

        return attr;
    }
}
