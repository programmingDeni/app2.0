package com.example.machine_management.services;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.exceptions.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MachineAttributeService {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineAttributeRepository attributeRepository;

    public List<MachineAttributeDto> getAllAttributes() {
        return attributeRepository.findAll()
            .stream()
            .map(MachineAttributeMapper::toDto)
            .collect(Collectors.toList());
    }

    public MachineAttributeDto getAttributeById(Integer id) {
        //finde attribut oder werfe fehler
        MachineAttribute attribute = attributeRepository.findById(id).orElseThrow(() -> new NotFoundException("Attribut mit ID " + id + " nicht gefunden."));
        //konvertiere zu dto und return 
        return MachineAttributeMapper.toDto(attribute);
    }

    public MachineAttributeDto createMachineAttribute(MachineAttributeDto request) {
        //finde machine oder werfe fehler
        Machine machine = machineRepository.findById(request.machineId).orElseThrow(() -> new NotFoundException("Maschine mit ID " + request.machineId + " nicht gefunden."));
        //erstelle neues attribute mit machine, name und type 
        MachineAttribute attr = new MachineAttribute(machine, request.attributeName,AttributeType.valueOf(request.attributeType));
        //speichere attribute
        MachineAttribute saved = attributeRepository.save(attr);
        //konvertiere zu dto und return
        return MachineAttributeMapper.toDto(saved);
    }


    public MachineAttributeDto updateAttribute(Integer id, MachineAttributeDto request) {
        //finde attribute oder werfe fehler
        return attributeRepository.findById(id)
            .map(attr -> {
                //TODO: 
                ////attributname und typ updaten, machine anschienend nciht 
                attr.setAttributeName(request.attributeName);
                attr.setType(AttributeType.valueOf(request.attributeType));
                MachineAttribute saved = attributeRepository.save(attr);
                return MachineAttributeMapper.toDto(saved);
            })
            .orElseThrow(() -> new NotFoundException("Attribut mit ID " + id + " nicht gefunden."));
    }

    public void deleteAttribute(Integer id) {
        if (!attributeRepository.existsById(id)) {
            throw new NotFoundException("Attribut mit ID " + id + " nicht gefunden.");
        }
        attributeRepository.deleteById(id);
    }
}