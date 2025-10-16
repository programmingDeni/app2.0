package com.example.machine_management.services.machine;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.services.GenericCrudService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für die Verwaltung von Maschinen (Machine Entities).
 * Erweitert den GenericCrudService für Standard-CRUD-Operationen und
 * delegiert spezialisierte Operationen an dedizierte Services.
 * 
 * Standard-CRUD-Operationen (geerbt):
 * - {@link #findAll()} - Liste aller Maschinen
 * - {@link #findById(Integer)} - Maschine mit allen Relations
 * - {@link #create(MachineDto)} - Neue Maschine erstellen
 * - {@link #delete(Integer)} - Maschine löschen
 * 
 * Template-bezogene Operationen (delegiert an MachineTemplateOperations):
 * - {@link #assignTemplate(Integer, Integer)} - Template einer Maschine zuweisen
 * - {@link #removeTemplateFromMachine(Integer)} - Template von Maschine entfernen
 * - {@link #createMachineFromTemplate(CreateMachineFromTemplateDto)} - Neue Maschine aus Template
 * 
 * Attribute-bezogene Operationen (delegiert an MachineAttributeOperations):
 * - {@link #addMachineAttribute(Integer, CreateMachineAttributeDto)} - Attribut hinzufügen
 * - {@link #editMachineAttribute(Integer, Integer, MachineAttributeDto)} - Attribut bearbeiten
 * - {@link #removeMachineAttribute(Integer, Integer)} - Attribut entfernen
 * 
 * @see GenericCrudService
 * @see MachineTemplateOperations
 * @see MachineAttributeOperations
 * @see Machine
 * @see MachineDto
 * 
 * @throws NotFoundException wenn eine Entity nicht gefunden wird
 * @throws IllegalArgumentException bei invaliden Eingabedaten
 */

@Service
public class MachineService extends GenericCrudService<Machine, Integer, MachineDto> {
    
    //für spezielle Operationen

    private final MachineTemplateOperationsService machineTemplateOperationsService;
    private final MachineAttributeOperationsService machineAttributeOperationsService;

    @Autowired
    public MachineService(
            MachineRepository machineRepository,
            MachineMapper mapper,
            MachineTemplateOperationsService machineTemplateOperationsService,
            MachineAttributeOperationsService machineAttributeOperationsService) {
        super(machineRepository, mapper);
        this.machineTemplateOperationsService = machineTemplateOperationsService;
        this.machineAttributeOperationsService = machineAttributeOperationsService;
    }

    /**
     * Findet Maschine by ID mit allen Relations (eager loading).
     * Lädt: MachineAttributes (mit Values), MachineTemplate
     * 
     * @param id Machine ID
     * @return Machine mit allen geladenen Relations
     * @throws NotFoundException wenn Maschine nicht gefunden
     */
    @Override
    public Machine findById(Integer id) {
        //TODO: funktioniert das eager loading?
        //hier spezielle Implementation mit findWithAllDataById. soll eager laden
        Machine machine = ((MachineRepository) repo).findWithAllDataById(id)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));
        return machine;
    }

    /**
     * Implementation der abstrakten updateEntity Methode.
     * Aktualisiert den Namen einer Maschine.
     * Andere Eigenschaften (Template, Attribute) werden über dedizierte Methoden verwaltet.
     *
     * @param existingEntity die zu aktualisierende Maschine
     * @param machineDto DTO mit den neuen Daten
     * @return die aktualisierte Maschine
     * @throws IllegalArgumentException wenn der Maschinenname leer ist
     * @throws NotFoundException wenn die Maschine nicht gefunden wurde
     */
    @Override
    protected Machine updateEntity(Machine existingEntity, MachineDto machineDto) {
        if (machineDto.machineName == null || machineDto.machineName.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = ((MachineRepository)repo).findById(existingEntity.getId())
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + existingEntity.getId() + " nicht gefunden."));

        machine.setMachineName(machineDto.machineName);
        Machine saved = ((MachineRepository)repo).save(machine);
        return saved;
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MACHINEN TEMPLATE OPS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    /**
     * Erstellt neue Maschine aus Template.
     * delegiert an {@link MachineTemplateOperationsService#createMachineFromTemplate(CreateMachineFromTemplateDto)}
     */
    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        return machineTemplateOperationsService.createMachineFromTemplate(dto);
    }

    /**
     * Weist einer Maschine ein Template zu.
     * delegiert an {@link MachineTemplateOperationsService#assignTemplate(Integer, Integer)}
     */
    public Machine assignTemplate(Integer machineId, Integer templateId) {
        return machineTemplateOperationsService.assignTemplate(machineId, templateId);
    }

    /**
     * Entfernt Template von einer Maschine.
     * delegiert an {@link MachineTemplateOperationsService#removeTemplateFromMachine(Integer)}
     */
    public void removeTemplateFromMachine(Integer machineId) {
        machineTemplateOperationsService.removeTemplateFromMachine(machineId);
    }

    /**
     * Findet alle Maschinen eines Templates.
     * delegiert an {@link MachineTemplateOperationsService#findByTemplate(MachineTemplate)}
     */
    public List<Machine> findByTemplate(MachineTemplate template) {
        return machineTemplateOperationsService.findByTemplate(template);
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MACHINEN ATTRIBUTE OPS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    /**
     * Entfernt ein Attribut von einer Maschine.
     * delegiert an {@link MachineAttributeOperationsService#removeMachineAttribute(Integer, Integer)}
     */
    public void removeMachineAttribute(Integer machineId, Integer attributeId) {
        machineAttributeOperationsService.removeMachineAttribute(machineId, attributeId);
    }

    /**
     * Bearbeitet ein Attribut einer Maschine.
     * delegiert an {@link MachineAttributeOperationsService#editMachineAttribute(Integer, Integer, MachineAttributeDto)}
     */
    public MachineAttribute editMachineAttribute(Integer machineId, Integer attributeId, MachineAttributeDto dto) {
        return machineAttributeOperationsService.editMachineAttribute(machineId, attributeId, dto);
    }

    /**
     * Fügt eine neues Attribut zu einer Maschine hinzu.
     * delegiert an {@link MachineAttributeOperationsService#addMachineAttribute(Integer, CreateMachineAttributeDto)}
     */
    public MachineAttribute addMachineAttribute(Integer machineId, CreateMachineAttributeDto dto) {
        return machineAttributeOperationsService.addMachineAttribute(machineId, dto);
    }
}