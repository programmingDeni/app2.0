package com.example.machine_management.services.machine;

import org.springframework.beans.factory.annotation.Autowired;
//dtos
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
//Exception
import com.example.machine_management.exceptions.NotFoundException;
//models
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;
//repo
import com.example.machine_management.repository.MachineRepository;

public class MachineAttributeOperationsService {

    private final MachineRepository machineRepo;

    @Autowired
    public MachineAttributeOperationsService(MachineRepository machineRepo) {
        this.machineRepo = machineRepo;
    }

    /*
     * Attribute-bezogene Operationen
     */
    // Helper method to find machine and validate
    private Machine findMachineWithAttributes(Integer machineId) {
        return ((MachineRepository)machineRepo).findWithAllDataById(machineId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));
    }

    // Helper method to find attribute in machine
    private MachineAttribute findAttributeInMachine(Machine machine, Integer attributeId) {
        return machine.getMachineAttributes()
                .stream()
                .filter(attr -> attr.getId().equals(attributeId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Maschineattribut mit ID " + attributeId + " nicht gefunden."));
    }

    /**
     * Entfernt ein Attribut von einer Maschine.
     * 
     * @param machineId ID der Maschine
     * @param attributeId ID des zu löschenden Attributs
     * @throws NotFoundException wenn Maschine oder Attribut nicht gefunden
     */
    public void removeMachineAttribute(Integer machineId, Integer attributeId) {
        Machine machine = findMachineWithAttributes(machineId);
        findAttributeInMachine(machine, attributeId); // Verify attribute exists
        
        machine.getMachineAttributes().removeIf(attr -> attr.getId().equals(attributeId));
        ((MachineRepository)machineRepo).save(machine);
    }

    /**
     * Bearbeitet ein Attribut einer Maschine.
     * 
     * @param machineId ID der Maschine
     * @param attributeId ID des zu bearbeitenden Attributs
     * @param dto DTO mit den neuen Attributwerten
     * @return Aktualisierte Machine
     * @throws NotFoundException wenn Maschine oder Attribut nicht gefunden
     * @throws IllegalArgumentException bei invaliden Attributdaten
     */
    public MachineAttribute editMachineAttribute(Integer machineId, Integer attributeId, MachineAttributeDto dto) {
        Machine machine = findMachineWithAttributes(machineId);
        MachineAttribute attribute = findAttributeInMachine(machine, attributeId);
        
        attribute.setAttributeName(dto.attributeName);
        attribute.setType(AttributeType.valueOf(dto.attributeType));
        
        ((MachineRepository)machineRepo).save(machine);
        return attribute;
    }

    // Add attribute to machine
    public MachineAttribute addMachineAttribute(Integer machineId, CreateMachineAttributeDto dto) {
        Machine machine = findMachineWithAttributes(machineId);
        
        MachineAttribute newAttribute = new MachineAttribute(
            machineId,
            dto.attributeName,
            AttributeType.valueOf(dto.attributeType),
            false  // not from template
        );
        
        machine.getMachineAttributes().add(newAttribute);
        ((MachineRepository)machineRepo).save(machine);
        return newAttribute;
    }
}
