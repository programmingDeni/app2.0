package com.example.machine_management.services;

import java.util.Optional;
import java.util.stream.Collectors;
import java.text.AttributedCharacterIterator.Attribute;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.repository.AttributeValueRepository;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.dto.AttributeValueDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeValue;

@Service
public class AttributeValueService {

    @Autowired
    private AttributeValueRepository attributeValueRepository;

    @Autowired
    private MachineAttributeRepository machineAttributeRepository;
    
    //CRUD
    public List<AttributeValueDto> getAllAttributeValues() {
        return attributeValueRepository.findAll()
            .stream()
            .map(AttributeValueMapper::toDto)
            .collect(Collectors.toList());
    }

    public AttributeValueDto getAttributeValueById(Integer id) {
        AttributeValue value = attributeValueRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Attributwert mit ID " + id + " nicht gefunden."));
        return AttributeValueMapper.toDto(value);
    }

    public List<AttributeValueDto> getAttributeValuesByMachineAttributeId(Integer attributeId) {
        return attributeValueRepository.findByMachineAttributeId(attributeId)
            .stream()
            .map(AttributeValueMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<AttributeValueDto> getAttributeValuesByYear(Integer year) {
        return attributeValueRepository.findAllByYear(year)
            .stream()
            .map(AttributeValueMapper::toDto)
            .collect(Collectors.toList());
    }

    public AttributeValueDto createOrUpdateAttributeValue(AttributeValueDto attributeValueDto) {
        //MachineAttribute attribute = machineAttributeRepository.findBy attributeValueDto.machineAttributeId;

        // 1. Existenzprüfung
        MachineAttribute existingAttribute = machineAttributeRepository.findById(attributeValueDto.machineAttributeId)
            .orElseThrow(() -> new IllegalArgumentException("MachineAttribute not found"));

        int year = attributeValueDto.year;
        String value = attributeValueDto.attributeValue;

        // 2. Gibt es schon einen Wert für dieses Jahr?
        Optional<AttributeValue> existingValueOpt = attributeValueRepository
            .findByMachineAttributeAndYear(existingAttribute, year);

        AttributeValue toSave;

        if (existingValueOpt.isPresent()) {
            // 3. Wert aktualisieren
            AttributeValue existingValue = existingValueOpt.get();
            existingValue.setAttributeValue(value);
            toSave = existingValue;
        } else {
            // 4. Neuer Wert
            toSave = new AttributeValue(existingAttribute, year);
            toSave.setAttributeValue(value);
        }

        // 5. Speichern
        AttributeValue saved = attributeValueRepository.save(toSave);
        return AttributeValueMapper.toDto(saved);
    }

    public void deleteAttributeValue(Integer id) {
        if (!attributeValueRepository.existsById(id)) {
            new NotFoundException("Attributwert mit ID " + id + " nicht gefunden.");
        }
        attributeValueRepository.deleteById(id);
    }
}
