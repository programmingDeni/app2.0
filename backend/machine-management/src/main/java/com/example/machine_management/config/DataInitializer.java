package com.example.machine_management.config;

import java.text.AttributedCharacterIterator.Attribute;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.example.machine_management.dto.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.MachineDto;
import com.example.machine_management.models.*;
import com.example.machine_management.repository.*;
import com.example.machine_management.services.MachineService;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            MachineTemplateRepository templateRepo,
            AttributeTemplateRepository attrTemplateRepo, MachineRepository machineRepo,MachineService machineService) {
        return args -> {
            System.out.println("Initialisiere Test-Templates...");


            //Machine Erstellen
            Machine machine1 = new Machine("Machine 1");
            machine1 = machineRepo.save(machine1);

            // Template erstellen 
            MachineTemplate template1 = new MachineTemplate();
            template1.setTemplateName("Template 1");
            template1 = templateRepo.save(template1);

            //AttributeInTempalte 
            AttributeInTemplate attr1 = new AttributeInTemplate("Attribute Boolean", AttributeType.BOOLEAN, template1);
            AttributeInTemplate attr2 = new AttributeInTemplate("Attribute String", AttributeType.STRING, template1);
            attrTemplateRepo.save((attr2));
            attrTemplateRepo.save(attr1);

            //attribute tdem template hinzufügen
            template1.addAttribute(attr1);
            template1.addAttribute(attr2);
            template1 = templateRepo.save(template1);



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