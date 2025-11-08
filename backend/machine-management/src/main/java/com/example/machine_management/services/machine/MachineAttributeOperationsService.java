package com.example.machine_management.services.machine;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//dtos
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
//Exception
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.mapper.MachineAttributeMapper;
//models
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.repository.MachineAttributeRepository;
//repo
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.services.GenericCrudService;

import com.example.machine_management.util.SecurityUtils;

@Service
public class MachineAttributeOperationsService {

    private final MachineRepository machineRepo;

    private final MachineAttributeRepository machineAttributeRepo;

    @Autowired
    public MachineAttributeOperationsService(MachineRepository machineRepo,
            MachineAttributeRepository machineAttributeRepo, MachineAttributeMapper mapper) {
        this.machineRepo = machineRepo;
        this.machineAttributeRepo = machineAttributeRepo;
    }

    // ============= Cross-Entity Operations (Machine + Attribute) =============

    /**
     * Fügt ein neues Attribut zu einer Maschine hinzu.
     * Prüft userId-Ownership der Maschine.
     *
     * @param machineId ID der Maschine
     * @param dto       DTO mit Attributdaten
     * @return Neu erstelltes MachineAttribute
     * @throws NotFoundException wenn Maschine nicht gefunden
     */
    public MachineAttribute addMachineAttribute(Integer machineId, CreateMachineAttributeDto dto) {
        Integer userId = SecurityUtils.getCurrentUserId();
        Machine machine = findMachineWithAttributes(machineId);

        MachineAttribute newAttribute = new MachineAttribute(
                machineId,
                dto.attributeName,
                AttributeType.valueOf(dto.attributeType),
                false); // not from template

        newAttribute.setUserId(userId); // Set userId on new attribute

        machine.getMachineAttributes().add(newAttribute);
        machineRepo.save(machine);
        return newAttribute;
    }

    /**
     * Entfernt ein Attribut von einer Maschine.
     * Prüft userId-Ownership.
     *
     * @param machineId   ID der Maschine
     * @param attributeId ID des zu löschenden Attributs
     * @throws NotFoundException wenn Maschine oder Attribut nicht gefunden
     */
    public void removeMachineAttribute(Integer machineId, Integer attributeId) {
        Machine machine = findMachineWithAttributes(machineId);
        findAttributeInMachine(machine, attributeId); // Verify attribute exists

        machine.getMachineAttributes().removeIf(attr -> attr.getId().equals(attributeId));
        machineRepo.save(machine);
    }

    /**
     * Bearbeitet ein Attribut einer Maschine.
     * Prüft userId-Ownership.
     *
     * @param machineId   ID der Maschine
     * @param attributeId ID des zu bearbeitenden Attributs
     * @param dto         DTO mit den neuen Attributwerten
     * @return Aktualisiertes MachineAttribute
     * @throws NotFoundException        wenn Maschine oder Attribut nicht gefunden
     * @throws IllegalArgumentException bei invaliden Attributdaten
     */
    public MachineAttribute editMachineAttribute(Integer machineId, Integer attributeId, MachineAttributeDto dto) {
        Machine machine = findMachineWithAttributes(machineId);
        MachineAttribute attribute = findAttributeInMachine(machine, attributeId);

        if (dto.attributeName != null) {
            attribute.setAttributeName(dto.attributeName);
        }
        if (dto.attributeType != null) {
            attribute.setType(AttributeType.valueOf(dto.attributeType));
        }
        if (dto.pruefungsIntervall != null) {
            attribute.setPruefungsIntervall(dto.pruefungsIntervall);
        }
        if (dto.attributeValues != null) {
            // TODO: attributeValues wo aktuiallisisren?
            // dto.attributeValues.forEach(AttributeValueMapper.toEntity(attributeValue,
            // attribute));
            /*
             * List<AttributeValue> mappedValues = dto.attributeValues.stream()
             * .map(valueDto -> AttributeValueMapper.toEntity(valueDto, attribute))
             * .collect(Collectors.toList());
             * attribute.setAttributeValues(mappedValues);
             */
        }

        machineAttributeRepo.save(attribute);
        return attribute;
    }

    /**
     * Lädt Attribute einer Maschine (lazy - ohne AttributeValues).
     * Filtert nach userId.
     *
     * @param machineId ID der Maschine
     * @return Liste der MachineAttributes ohne Values
     */
    public List<MachineAttribute> getMachineAttributesLazy(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return machineAttributeRepo.findByMachineIdAndUserId(machineId, userId);
    }

    /**
     * Lädt Attribute einer Maschine (eager - mit AttributeValues).
     * Filtert nach userId.
     *
     * @param machineId ID der Maschine
     * @return Liste der MachineAttributes mit Values
     */
    public List<MachineAttribute> getMachineAttributesEager(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return machineAttributeRepo.findAttributesWithValuesByMachineIdAndUserId(machineId, userId);
    }

    // ============= Helper Methods =============

    /**
     * Helper method to find machine with attributes and validate userId ownership.
     */
    private Machine findMachineWithAttributes(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return machineRepo.findWithAllDataByIdAndUserId(machineId, userId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));
    }

    /**
     * Helper method to find attribute in machine.
     */
    private MachineAttribute findAttributeInMachine(Machine machine, Integer attributeId) {
        return machine.getMachineAttributes()
                .stream()
                .filter(attr -> attr.getId().equals(attributeId))
                .findFirst()
                .orElseThrow(
                        () -> new NotFoundException("Maschineattribut mit ID " + attributeId + " nicht gefunden."));
    }

}
