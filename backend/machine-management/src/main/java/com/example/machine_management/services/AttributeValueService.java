package com.example.machine_management.services;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.repository.AttributeValueRepository;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.dto.AttributeValueDto;
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
    public void createOrUpdateAttributeValue(AttributeValueDto attributeValueDto) {
        MachineAttribute attribute = attributeValueDto.machineAttribute;

        // 1. Existenzprüfung
        MachineAttribute existingAttribute = machineAttributeRepository.findById(attribute.getId())
            .orElseThrow(() -> new IllegalArgumentException("MachineAttribute not found"));

        int year = attributeValueDto.year;
        String value = attributeValueDto.value;

        // 2. Gibt es schon einen Wert für dieses Jahr?
        Optional<AttributeValue> existingValueOpt = attributeValueRepository
            .findByMachineAttributeAndYear(existingAttribute, year);

        AttributeValue toSave;

        if (existingValueOpt.isPresent()) {
            // 3. Wert aktualisieren
            AttributeValue existingValue = existingValueOpt.get();
            existingValue.setValue(value);
            toSave = existingValue;
        } else {
            // 4. Neuer Wert
            toSave = new AttributeValue(existingAttribute, year);
            toSave.setValue(value);
        }

        // 5. Speichern
        attributeValueRepository.save(toSave);
    }


    public void updateAttributeValue(AttributeValueDto attributeValueDto){

    }
}
