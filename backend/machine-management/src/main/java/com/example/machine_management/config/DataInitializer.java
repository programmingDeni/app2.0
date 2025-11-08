package com.example.machine_management.config;

import java.text.AttributedCharacterIterator.Attribute;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.models.*;
import com.example.machine_management.repository.*;
import com.example.machine_management.services.machine.MachineService;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            MachineTemplateRepository templateRepo,
            AttributeTemplateRepository attrTemplateRepo, MachineRepository machineRepo,
            MachineService machineService) {
        return args -> {

            if (machineRepo.count() > 0 || templateRepo.count() > 0) {
                System.out.println("DB enthält bereits Daten: Initialisierung übersprungen.");
                return;
            }

            System.out.println("Erstelle Admin-User...");

            // Admin-User erstellen
            User adminUser = new User();
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // BCrypt-Hash
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser = userRepo.save(adminUser);

            System.out.println("Admin-User erstellt: " + adminUser.getEmail());

            System.out.println("Initialisiere Test-Templates...");

            // Template erstellen
            MachineTemplate template1 = new MachineTemplate();
            template1.setTemplateName("Template 1");
            template1.setUserId(adminUser.getId());
            template1.setCreatedBy(adminUser.getId());
            template1 = templateRepo.save(template1);

            // AttributeInTempalte
            TemplateAttribute attr1 = new TemplateAttribute("Attribute Boolean", AttributeType.BOOLEAN, template1);
            TemplateAttribute attr2 = new TemplateAttribute("Attribute String", AttributeType.STRING, template1);
            attr1.setUserId(adminUser.getId());
            attr2.setUserId(adminUser.getId());
            attr2.setCreatedBy(adminUser.getId());
            attr1.setCreatedBy(adminUser.getId());
            attrTemplateRepo.save((attr2));
            attrTemplateRepo.save(attr1);

            // attribute tdem template hinzufügen
            template1.addAttribute(attr1);
            template1.addAttribute(attr2);
            template1 = templateRepo.save(template1);

            // Machine aus Template erstellen
            // Machine erstellen und speichern
            Machine createdMachine = new Machine("Machine1 1 1");
            createdMachine.setUserId(adminUser.getId());
            createdMachine.setCreatedBy(adminUser.getId());
            createdMachine.setMachineTemplate(template1);
            createdMachine = machineRepo.save(createdMachine);

            System.out.println("Erstellte Maschine:");
            System.out.println("Name: " + createdMachine.getMachineName());
            System.out.println("Template: " + (createdMachine.getMachineTemplate() != null
                    ? createdMachine.getMachineTemplate().getTemplateName()
                    : "Kein Template"));

            for (MachineAttribute attr : createdMachine.getMachineAttributes()) {
                System.out.println("- Attribut: " + attr.getAttributeName() + " (" + attr.getType() + ")");
            }

            System.out.println("Test-Daten initialisiert!");
        };
    }

    private void createAttributeTemplate(
            AttributeTemplateRepository repo,
            MachineTemplate template,
            String name,
            AttributeType type) {
        TemplateAttribute attr = new TemplateAttribute(name, type, template);
        repo.save(attr);
    }
}