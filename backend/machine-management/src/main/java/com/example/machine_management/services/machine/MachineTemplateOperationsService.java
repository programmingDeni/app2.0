package com.example.machine_management.services.machine;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.util.SecurityUtils;
//models
import com.example.machine_management.models.TemplateAttribute;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
//repos
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineTemplateRepository;

@Service
public class MachineTemplateOperationsService {
    // NO GenericCrudService extension!

    private final MachineRepository machineRepo;
    private final MachineTemplateRepository machineTemplateRepository;

    @Autowired
    public MachineTemplateOperationsService(
            MachineRepository machineRepo,
            MachineTemplateRepository machineTemplateRepository) {
        this.machineRepo = machineRepo;
        this.machineTemplateRepository = machineTemplateRepository;
    }

    // ============= Cross-Entity Operations (Machine + Template) =============

    /**
     * Erstellt neue Maschine aus Template.
     * 1. Erstellt Maschine mit userId
     * 2. Weist Template zu (mit userId-Filterung)
     * 3. Kopiert Template-Attribute (mit userId)
     *
     * @param dto CreateMachineFromTemplateDto mit machineName und machineTemplateId
     * @return Erstellte Machine mit Template und Attributen
     * @throws NotFoundException        wenn Template nicht gefunden
     * @throws IllegalArgumentException bei invaliden Daten
     */
    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // Create machine with userId
        Machine newMachine = new Machine(dto.machineName);
        newMachine.setUserId(userId);
        Machine saved = machineRepo.save(newMachine);

        // Assign template (includes userId filtering)
        return assignTemplate(saved.getId(), dto.machineTemplateId);
    }

    /**
     * Entfernt Template von einer Maschine.
     * Löscht auch alle Template-basierten Attribute.
     * Prüft userId-Ownership.
     *
     * @param machineId ID der Maschine
     * @throws NotFoundException        wenn Maschine nicht gefunden
     * @throws IllegalArgumentException wenn Maschine kein Template hat
     */
    public void removeTemplateFromMachine(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // machine suchen mit userId-Filterung
        Machine machine = machineRepo.findByIdAndUserId(machineId, userId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));

        // template? sonst fehler
        if (machine.getMachineTemplate() == null) {
            throw new IllegalArgumentException("Maschine hat kein Template zugewiesen");
        }

        // machine existiert und hat ein template
        // setze template = null und entferne die template attribute
        machine.setMachineTemplate(null);
        machine.getMachineAttributes().removeIf(attr -> attr.isFromTemplate());

        // save
        machineRepo.save(machine);
    }

    /**
     * Weist einer Maschine ein Template zu und kopiert dessen Attribute.
     * Lädt Maschine und Template mit allen notwendigen Relations.
     * Prüft userId-Ownership für Machine UND Template.
     *
     * @param machineId  ID der Maschine
     * @param templateId ID des Templates
     * @return Aktualisierte Machine mit Template und kopierten Attributen
     * @throws NotFoundException wenn Machine oder Template nicht gefunden
     */
    public Machine assignTemplate(Integer machineId, Integer templateId) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // eager load mit userId-Filterung
        Machine machine = machineRepo.findWithAllDataByIdAndUserId(machineId, userId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineTemplateOperationsService] assignTemplate(): Maschine mit ID " + machineId
                                + " nicht gefunden."));

        MachineTemplate template = machineTemplateRepository.findByIdWithAttributesAndUserId(templateId, userId)
                .orElseThrow(() -> new NotFoundException(
                        "[MachineTemplateOperationsService] assignTemplate(): Template mit ID " + templateId
                                + " nicht gefunden."));

        machine.setMachineTemplate(template);

        // Copy template attributes to machine with userId
        for (TemplateAttribute templateAttr : template.getAttributeTemplates()) {
            MachineAttribute machineAttr = new MachineAttribute(
                    machineId,
                    templateAttr.getAttributeInTemplateName(),
                    templateAttr.getType(),
                    true); // fromTemplate = true
            machineAttr.setUserId(userId);
            machine.getMachineAttributes().add(machineAttr);
        }

        return machineRepo.save(machine);
    }

    /**
     * Findet alle Maschinen, die ein bestimmtes Template verwenden.
     * Filtert automatisch nach userId des Templates.
     *
     * @param template Das Template nach dem gefiltert wird
     * @return Liste der Maschinen mit diesem Template
     */
    public List<Machine> findByTemplate(MachineTemplate template) {
        Integer userId = SecurityUtils.getCurrentUserId();

        // Verify template belongs to user
        if (!template.getUserId().equals(userId)) {
            throw new NotFoundException("Template nicht gefunden.");
        }

        return machineRepo.findAllByMachineTemplateIdAndUserId(template.getId(), userId);
    }
}