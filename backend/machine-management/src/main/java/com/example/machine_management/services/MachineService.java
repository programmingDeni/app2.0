package com.example.machine_management.services;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.AttributeInTemplate;
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
        if (machineDto.name == null || machineDto.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = new Machine(machineDto.name);
        Machine saved = machineRepository.save(machine);
        return saved;
    }

    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        // template finden oder fehler werfen
        // hier wird lazy geladen aber ich brauche die attributeTemplates auch
        MachineTemplate template = machineTemplateRepository.findByIdWithAttributes(dto.machineTemplateId).orElseThrow(
                () -> new NotFoundException("Template mit ID " + dto.machineTemplateId + " nicht gefunden."));
        // Machine erstellen
        Machine newMachine = new Machine(dto.machineName);
        // template setzen
        newMachine.setMachineTemplate(template);
        // attribute aus temmplate initialisieren
        for (AttributeInTemplate t : template.getAttributeTemplates()) {
            MachineAttribute attr = new MachineAttribute(newMachine, t.getAttributeInTemplateName(), t.getType(), true);
            /*
             * //initialisierung vom Template ohne values
             * public MachineAttribute(Machine besitzendeMachine, String attributeName,
             * AttributeType type, boolean fromTemplate){
             * this(besitzendeMachine, attributeName, type);
             * this.fromTemplate = fromTemplate;
             * }
             */
            // newMachine.addAttribute(attr);
            // TODO: wie bekommt machine davon mit???
        }

        Machine saved = machineRepository.save(newMachine);

        return saved;

    }

    public Machine updateMachine(Integer id, MachineDto machineDto) {
        if (machineDto.name == null || machineDto.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));

        machine.setMachineName(machineDto.name);
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

    public void assignTemplate(Integer machineId, Integer templateId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineService] assignTemplate(): Maschine mit ID " + machineId + " nicht gefunden."));

        MachineTemplate template = machineTemplateRepository.findById(templateId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineService] assignTemplate(): Template mit ID " + templateId + " nicht gefunden."));

        machine.setMachineTemplate(template);

        for (AttributeInTemplate templateAttr : template.getAttributeTemplates()) {
            // machinen attribute sollten über machiine gespeichert werden
            MachineAttribute machineAttr = new MachineAttribute(
                    machine,
                    templateAttr.getAttributeInTemplateName(),
                    templateAttr.getType(),
                    true);
            machine.getMachineAttributes().add(machineAttr);
        }

        machineRepository.save(machine);
    }

}