package com.example.machine_management.mapper;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.models.enums.AttributeType;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;

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
        attr.setAttributeType((dto.attributeType));
        attr.setPruefungsIntervall(dto.pruefungsIntervall);
        return attr;
    }

    public MachineAttributeDto toDtoEager(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getAttributeType(),
                attr.getAttributeValues().stream()
                        .map(attributeValueMapper::toDto)
                        .collect(Collectors.toList()),
                attr.getMachine().getId(),
                attr.isFromTemplate(),
                attr.getPruefungsIntervall());
    }

    public MachineAttributeDto toDtoLazy(MachineAttribute attr) {
        return new MachineAttributeDto(
                attr.getId(),
                attr.getAttributeName(),
                attr.getAttributeType(),
                new ArrayList<>(),
                attr.getMachine().getId(),
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
        MachineAttribute attr = new MachineAttribute();
        //userid muss wo anders gesetzt werden
        attr.setAttributeName(machineAttributeDto.attributeName);
        attr.setAttributeType((machineAttributeDto.attributeType)); // <-- hier Umwandlung String → Enum
        //attribtuevalues?
        if (machineAttributeDto.attributeValues != null) {
            attr.setAttributeValues(machineAttributeDto.attributeValues.stream()
                    .map(val -> attributeValueMapper.toEntity(val, attr))
                    .collect(Collectors.toList()));
        }
        

        return attr;
    }

    @Override
    public List<MachineAttributeDto> toDtoList(List<MachineAttribute> entities) {
        return entities.stream().map(this::toDto).toList();
    }
}
