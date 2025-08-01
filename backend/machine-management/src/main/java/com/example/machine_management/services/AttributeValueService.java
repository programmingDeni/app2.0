package com.example.machine_management.services;

import java.util.Optional;
import java.util.stream.Collectors;
import java.text.AttributedCharacterIterator.Attribute;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.repository.AttributeValueRepository;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
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

    // CRUD
    public List<AttributeValue> getAllAttributeValues() {
        return attributeValueRepository.findAll();
    }

    public AttributeValue getAttributeValueById(Integer id) {
        return attributeValueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attributwert mit ID " + id + " nicht gefunden."));
    }

    public List<AttributeValue> getAttributeValuesByMachineAttributeId(Integer attributeId) {
        return attributeValueRepository.findByMachineAttributeId(attributeId);
    }

    public List<AttributeValue> getAttributeValuesByYear(Integer year) {
        return attributeValueRepository.findAllByAttributeValueYear(year);
    }

    public AttributeValue createOrUpdateAttributeValue(AttributeValueDto attributeValueDto) {
        // MachineAttribute attribute = machineAttributeRepository.findBy
        // attributeValueDto.machineAttributeId;

        // 1. Existenzprüfung
        MachineAttribute existingAttribute = machineAttributeRepository.findById(attributeValueDto.machineAttributeId)
                .orElseThrow(() -> new IllegalArgumentException("MachineAttribute not found"));

        int year = attributeValueDto.attributeValueYear;
        String value = attributeValueDto.attributeValue;

        // 2. Gibt es schon einen Wert für dieses Jahr?
        Optional<AttributeValue> existingValueOpt = attributeValueRepository
                .findByMachineAttributeAndAttributeValueYear(existingAttribute, year);

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
        return saved;
    }

    public void deleteAttributeValue(Integer id) {
        if (!attributeValueRepository.existsById(id)) {
            new NotFoundException("Attributwert mit ID " + id + " nicht gefunden.");
        }
        attributeValueRepository.deleteById(id);
    }
}
