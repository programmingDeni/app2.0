package com.example.machine_management.services;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.repository.MachineAttributeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MachineService {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineAttributeRepository machineAttributeRepository;

    @Autowired
    private MachineTemplateRepository machineTemplateRepository;

    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    public Machine getMachineById(Integer id) {
        // hole die machine, im repo wird spezifiziert dass attribute und tempalte mit
        // geladen werden
        Machine machine = machineRepository.findWithAllDataById(id)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));
        List<MachineAttribute> attributesWithValues = machineAttributeRepository.findAttributesWithValues(id);

        machine.setMachineAttributes(attributesWithValues);

        return machine;
    }

    public Machine createMachine(MachineDto machineDto) {
        if (machineDto.machineName == null || machineDto.machineName.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = new Machine(machineDto.machineName);
        Machine saved = machineRepository.save(machine);
        return saved;
    }

    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        // machine erstellen, template assignen
        Machine newMachine = new Machine(dto.machineName);

        Machine saved = machineRepository.save(newMachine);

        return assignTemplate(saved.getId(), dto.machineTemplateId);

    }

    public Machine updateMachine(Integer id, MachineDto machineDto) {
        if (machineDto.machineName == null || machineDto.machineName.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));

        machine.setMachineName(machineDto.machineName);
        Machine saved = machineRepository.save(machine);
        return saved;
    }

    public void deleteMachine(Integer id) {
        if (!machineRepository.existsById(id)) {
            throw new NotFoundException("Maschine mit ID " + id + " nicht gefunden.");
        }
        machineRepository.deleteById(id);
    }

    public void removeTemplateFromMachine(Integer machineId) {
        // machine suchen sonst fehler werfen
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));
        // template suche nsonst fehler werfen
        if (machine.getMachineTemplate() == null) {
            throw new IllegalArgumentException("Maschine hat kein Template zugewiesen");
        }
        // machine existiert und hat ein template
        machine.setMachineTemplate(null);
        // template attribute aus machine entfernen
        machine.getMachineAttributes().removeIf(attr -> attr.getFromTemplate());
        // save
        machineRepository.save(machine);
    }

    public Machine assignTemplate(Integer machineId, Integer templateId) {
        // eager load
        Machine machine = machineRepository.findWithAllDataById(machineId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineService] assignTemplate(): Maschine mit ID " + machineId + " nicht gefunden."));

        MachineTemplate template = machineTemplateRepository.findByIdWithAttributes(templateId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineService] assignTemplate(): Template mit ID " + templateId + " nicht gefunden."));

        machine.setMachineTemplate(template);

        for (AttributeInTemplate templateAttr : template.getAttributeTemplates()) {
            // machinen attribute sollten über machiine gespeichert werden
            MachineAttribute machineAttr = new MachineAttribute(
                    machineId,
                    templateAttr.getAttributeInTemplateName(),
                    templateAttr.getType(),
                    true);
            machine.getMachineAttributes().add(machineAttr);
        }

        return machineRepository.save(machine);
    }

    public List<Machine> findByTemplate(MachineTemplate template) {
        return machineRepository.findByMachineTemplate(template);
    }

    public void removeMachineAttribute(Integer machineId, Integer attributeId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));

        boolean found = machine.getMachineAttributes()
                .stream()
                .anyMatch(attr -> attr.getId().equals(attributeId));

        if (!found) {
            throw new NotFoundException("Maschineattribut mit ID " + attributeId + " nicht gefunden.");
        }

        // Attribut entfernen
        machine.getMachineAttributes().removeIf(attr -> attr.getId().equals(attributeId));
        machineRepository.save(machine);
    }

    public Machine editMachineAttribute(Integer machineId, Integer attributeId, MachineAttributeDto dto) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));

        MachineAttribute attribute = machine.getMachineAttributes()
                .stream()
                .filter(attr -> attr.getId().equals(attributeId))
                .findFirst()
                .orElseThrow(
                        () -> new NotFoundException("Maschineattribut mit ID " + attributeId + " nicht gefunden."));

        attribute.setAttributeName(dto.attributeName);
        attribute.setType(AttributeType.valueOf(dto.attributeType));
        // attribute.setAttributeValues(dto.attributeValues);
        // TODO: attribute values fromDTO implementieren

        return machineRepository.save(machine);
    }

}