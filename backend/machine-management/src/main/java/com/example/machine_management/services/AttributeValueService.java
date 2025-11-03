package com.example.machine_management.services;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.repository.AttributeValueRepository;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.dto.AttributeValue.CreateAttributeValueDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.util.SecurityUtils;

@Service
public class AttributeValueService extends GenericCrudService<AttributeValue, Integer, AttributeValueDto> {

    private final AttributeValueRepository attributeValueRepository;
    private final MachineAttributeRepository machineAttributeRepository;
    private final MachineRepository machineRepository;

    @Autowired
    public AttributeValueService(
            AttributeValueRepository attributeValueRepository,
            AttributeValueMapper mapper,
            MachineAttributeRepository machineAttributeRepository,
            MachineRepository machineRepository) {
        super(attributeValueRepository, mapper);
        this.attributeValueRepository = attributeValueRepository;
        this.machineAttributeRepository = machineAttributeRepository;
        this.machineRepository = machineRepository;
    }

    // ============= Specialized Methods =============

    // Attribute Value wird hier erstellt - mit ownership checks
    public AttributeValue createAttributeValue(CreateAttributeValueDto createAttributeValueDto) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 1. Verify machine ownership
        Machine machine = machineRepository.findByIdAndUserId(createAttributeValueDto.machineId, userId)
                .orElseThrow(() -> new NotFoundException(
                        "Maschine mit ID " + createAttributeValueDto.machineId + " nicht gefunden."));

        // 2. Verify attribute ownership
        MachineAttribute attribute = machineAttributeRepository
                .findByIdAndUserId(createAttributeValueDto.attributeId, userId)
                .orElseThrow(() -> new NotFoundException(
                        "Attribut mit ID " + createAttributeValueDto.attributeId + " nicht gefunden."));

        // 3. Prüfen, ob das Attribut zur Maschine gehört
        if (!attribute.getMachineId().equals(machine.getId())) {
            throw new IllegalArgumentException(
                    "Attribut mit ID " + createAttributeValueDto.attributeId + " gehört nicht zur Maschine mit ID "
                            + createAttributeValueDto.machineId + ".");
        }

        AttributeValue toSave = new AttributeValue(attribute, createAttributeValueDto.attributeValueYear,
                createAttributeValueDto.attributeValue, LocalDateTime.now(), LocalDateTime.now());
        toSave.setUserId(userId);

        // 4. Speichern
        AttributeValue saved = attributeValueRepository.save(toSave);
        return saved;
    }

    // Specialized update logic for year-based values
    public AttributeValue updateAttributeValue(AttributeValueDto attributeValueDto) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // 1. Verify attribute ownership
        MachineAttribute existingAttribute = machineAttributeRepository
                .findByIdAndUserId(attributeValueDto.machineAttributeId, userId)
                .orElseThrow(() -> new NotFoundException("MachineAttribute not found"));

        int year = attributeValueDto.attributeValueYear;
        String value = attributeValueDto.attributeValue;

        // 2. Gibt es schon einen Wert für dieses Jahr?
        Optional<AttributeValue> existingValueOpt = attributeValueRepository
                .findByMachineAttributeAndAttributeValueYear(existingAttribute, year);

        AttributeValue toSave;

        if (existingValueOpt.isPresent()) {
            AttributeValue existingValue = existingValueOpt.get();
            // Verify ownership
            if (!existingValue.getUserId().equals(userId)) {
                throw new NotFoundException("AttributeValue not found");
            }
            // 3. Wert aktualisieren
            existingValue.setAttributeValue(value);
            existingValue.setZuletztGeprueft(attributeValueDto.zuletztGeprueft);
            existingValue.setZuletztGetauscht(attributeValueDto.zuletztGetauscht);
            toSave = existingValue;
        } else {
            // 4. Neuer Wert
            toSave = new AttributeValue(existingAttribute, year);
            toSave.setAttributeValue(value);
            toSave.setZuletztGeprueft(attributeValueDto.zuletztGeprueft);
            toSave.setZuletztGetauscht(attributeValueDto.zuletztGetauscht);
            toSave.setUserId(userId);
        }

        // 5. Speichern
        AttributeValue saved = attributeValueRepository.save(toSave);
        return saved;
    }

    // ============= Implementierung der abstrakten Methoden aus GenericCrudService
    // =============

    @Override
    protected AttributeValue updateEntity(AttributeValue existingEntity, AttributeValueDto dto) {
        existingEntity.setAttributeValueYear(dto.attributeValueYear);
        existingEntity.setAttributeValue(dto.attributeValue);
        existingEntity.setZuletztGeprueft(dto.zuletztGeprueft);
        existingEntity.setZuletztGetauscht(dto.zuletztGetauscht);
        return existingEntity;
    }

    @Override
    protected List<AttributeValue> findAllByUserId(Integer userId) {
        return attributeValueRepository.findByUserId(userId);
    }

    @Override
    protected Optional<AttributeValue> findByIdAndUserId(Integer id, Integer userId) {
        return attributeValueRepository.findByIdAndUserId(id, userId);
    }

    @Override
    protected void setUserId(AttributeValue entity, Integer userId) {
        entity.setUserId(userId);
    }

    public List<AttributeValue> getAttributeValuesByMachineId(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return attributeValueRepository.findByMachineAttributeMachineIdAndUserId(machineId, userId);
    }

}
