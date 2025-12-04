package com.example.machine_management.integration.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.repository.AttributeValueRepository;

import jakarta.transaction.Transactional;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class MachineIntegrationTest {

    @Autowired
    private MachineRepository machineRepo;

    @Autowired
    private AttributeValueRepository valueRepo;

    @Test
    void createMachineWithTemplate_createsAttributes() {
        /*
        // Template vorbereiten
        MachineTemplate template = new MachineTemplate("CNC-Vorlage");
        template.addAttribute(new AttributeInTemplate("Spannung", AttributeType.FLOAT));
        machineTemplateRepo.save(template);

        // Maschine daraus erstellen
        Machine machine = machineService.createFromTemplate(new CreateMachineFromTemplateDto("Fräse 1", template.getId()));

        assertEquals(1, machine.getAttributes().size());
        assertEquals("Spannung", machine.getAttributes().get(0).getAttributeName());
         */
    }
}
