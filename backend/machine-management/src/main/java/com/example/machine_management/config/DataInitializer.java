package com.example.machine_management.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.example.machine_management.models.*;
import com.example.machine_management.repository.*;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            MachineTemplateRepository templateRepo,
            AttributeTemplateRepository attrTemplateRepo) {
        return args -> {
            System.out.println("Initialisiere Test-Templates...");
            
            // Template 1 mit Attributen
            MachineTemplate template1 = new MachineTemplate();
            template1.setTemplateName("Drucker Template");
            template1 = templateRepo.save(template1);

            createAttributeTemplate(attrTemplateRepo, template1, "Druckgeschwindigkeit", AttributeType.INTEGER);
            createAttributeTemplate(attrTemplateRepo, template1, "Druckertyp", AttributeType.STRING);
            
            // Template 2 mit Attributen
            MachineTemplate template2 = new MachineTemplate();
            template2.setTemplateName("Router Template");
            template2 = templateRepo.save(template2);

            createAttributeTemplate(attrTemplateRepo, template2, "IP-Adresse", AttributeType.STRING);
            createAttributeTemplate(attrTemplateRepo, template2, "Bandbreite", AttributeType.INTEGER);

            System.out.println("Test-Daten initialisiert!");
        };
    }

    private void createAttributeTemplate(
            AttributeTemplateRepository repo, 
            MachineTemplate template,
            String name,
            AttributeType type) {
        AttributeInTemplate attr = new AttributeInTemplate(name, type, template);
        repo.save(attr);
    }
}