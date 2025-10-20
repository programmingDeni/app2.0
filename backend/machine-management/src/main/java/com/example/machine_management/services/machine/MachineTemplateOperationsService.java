package com.example.machine_management.services.machine;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.exceptions.NotFoundException;
//models
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
//repos 
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineTemplateRepository;

@Service
public class MachineTemplateOperationsService {

    private final MachineRepository machineRepo;

    private final MachineTemplateRepository machineTemplateRepository;

    @Autowired
    public MachineTemplateOperationsService(MachineRepository machineRepo,
            MachineTemplateRepository machineTemplateRepository) {
        this.machineRepo = machineRepo;
        this.machineTemplateRepository = machineTemplateRepository;
    }

    /**
     * Erstellt neue Maschine aus Template.
     * 1. Erstellt Maschine
     * 2. Weist Template zu
     * 3. Kopiert Template-Attribute
     * 
     * @param dto CreateMachineFromTemplateDto mit machineName und machineTemplateId
     * @return Erstellte Machine mit Template und Attributen
     * @throws NotFoundException        wenn Template nicht gefunden
     * @throws IllegalArgumentException bei invaliden Daten
     */
    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        Machine newMachine = new Machine(dto.machineName);
        Machine saved = ((MachineRepository) machineRepo).save(newMachine);
        return assignTemplate(saved.getId(), dto.machineTemplateId);
    }

    /**
     * Entfernt Template von einer Maschine.
     * Löscht auch alle Template-basierten Attribute.
     * 
     * @param machineId ID der Maschine
     * @throws NotFoundException        wenn Maschine nicht gefunden
     * @throws IllegalArgumentException wenn Maschine kein Template hat
     */
    public void removeTemplateFromMachine(Integer machineId) {
        // machine suchen sonst fehler werfen
        Machine machine = ((MachineRepository) machineRepo).findById(machineId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));
        // template? sonst fehler
        if (machine.getMachineTemplate() == null) {
            throw new IllegalArgumentException("Maschine hat kein Template zugewiesen");
        }
        // machine existiert und hat ein template
        // setze template = null und entferne die tempalte attribute
        machine.setMachineTemplate(null);
        machine.getMachineAttributes().removeIf(attr -> attr.isFromTemplate());
        // save
        ((MachineRepository) machineRepo).save(machine);
    }

    /**
     * Weist einer Maschine ein Template zu und kopiert dessen Attribute.
     * Lädt Maschine und Template mit allen notwendigen Relations.
     * 
     * @param machineId  ID der Maschine
     * @param templateId ID des Templates
     * @return Aktualisierte Machine mit Template und kopierten Attributen
     * @throws NotFoundException wenn Machine oder Template nicht gefunden
     */
    public Machine assignTemplate(Integer machineId, Integer templateId) {
        // eager load
        Machine machine = ((MachineRepository) machineRepo).findWithAllDataById(machineId)
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

        return ((MachineRepository) machineRepo).save(machine);
    }

    /**
     * Findet alle Maschinen, die ein bestimmtes Template verwenden.
     * 
     * @param template Das Template nach dem gefiltert wird
     * @return Liste der Maschinen mit diesem Template
     */
    public List<Machine> findByTemplate(MachineTemplate template) {
        return ((MachineRepository) machineRepo).findByMachineTemplate(template);
    }
}
