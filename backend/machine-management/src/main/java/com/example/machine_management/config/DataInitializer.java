package com.example.machine_management.config;

//spring
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
//jakarta
import jakarta.annotation.PostConstruct;
//java utils
import java.util.Collections;
//dtos
import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
//models
import com.example.machine_management.models.enums.AttributeType;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;
import com.example.machine_management.models.user.User;
//repos
import com.example.machine_management.repository.*;
import com.example.machine_management.security.UserPrincipal;
//services
import com.example.machine_management.services.machine.MachineService;
import com.example.machine_management.services.machine.MachineTemplateOperationsService;
import com.example.machine_management.services.templates.TemplateAttributeOperationsService;
//security context mock 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            MachineTemplateRepository templateRepo,
            TemplateAttributeRepository attrTemplateRepo, MachineRepository machineRepo,
            MachineService machineService,
            MachineTemplateOperationsService machineTemplateOperationsService,
            TemplateAttributeOperationsService templateAttributeOperationsService
            ) {
        return args -> {

            if (machineRepo.count() > 0 || templateRepo.count() > 0) {
                System.out.println("DB enthält bereits Daten: Initialisierung übersprungen.");
                return;
            }

            System.out.println("Erstelle Admin-User...");
            if (userRepo.findByEmail("admin@example.com").isEmpty()) {
                // Admin-User erstellen
                User adminUser = new User();
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("admin123")); // BCrypt-Hash
                adminUser.setFirstName("Admin");
                adminUser.setLastName("User");
                adminUser = userRepo.save(adminUser);
                System.out.println("Admin-User erstellt: " + adminUser.getEmail());
            }else{
                System.out.println("Admin-User existiert bereits, überspringe...");
            }
            
            // Admin aus DB laden für Templates/Machines
            User adminUser = userRepo.findByEmail("admin@example.com").get();

            UserPrincipal userPrincipal = new UserPrincipal(adminUser.getId(), adminUser.getEmail());
            // Mock Authentication für Admin-User setzen
            // Ermöglicht die Nutzung der Services, die SecurityUtils.getCurrentUserId() verwenden
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(userPrincipal, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);

            
            System.out.println("Security Context für Admin-User gesetzt (Mock Auth)");
            System.out.println("Initialisiere Test-Templates...");

            // Template erstellen
            MachineTemplate template1 = new MachineTemplate();
            template1.setTemplateName("Template 1");
            template1.setUserId(adminUser.getId());
            template1.setCreatedBy(adminUser.getId());
            template1 = templateRepo.save(template1);


            // attribute tdem template hinzufügen
            //denk auch ueber service oder?
            templateAttributeOperationsService.addToParent(template1.getId(),
                new CreateTemplateAttributeDTO("Boolean Attribut",AttributeType.BOOLEAN,template1.getId()));

            templateAttributeOperationsService.addToParent(template1.getId(),
                new CreateTemplateAttributeDTO("String Attribut",AttributeType.STRING,template1.getId()));

            template1 = templateRepo.findByIdWithAttributesAndUserId(template1.getId(),userPrincipal.getUserId()).orElseThrow();

            // Machine aus Template erstellen
            // Machine erstellen und speichern
            Machine createdMachine = new Machine("Machine one (1)");
            createdMachine.setUserId(adminUser.getId());
            createdMachine.setCreatedBy(adminUser.getId());
            createdMachine = machineRepo.save(createdMachine);
            //anstatt das template zu setzen muss der service fuer die zuweisung genutzt werden
            //createdMachine.setMachineTemplate(template1);
            machineTemplateOperationsService.assignTemplate(createdMachine.getId(),template1.getId());

            createdMachine = machineRepo.findWithAllDataById(createdMachine.getId()).orElseThrow();
            System.out.println("Erstellte Maschine:");
            System.out.println("Name: " + createdMachine.getMachineName());
            System.out.println("Template: " + (createdMachine.getMachineTemplate() != null
                    ? createdMachine.getMachineTemplate().getTemplateName()
                    : "Kein Template"));

            for (MachineAttribute attr : createdMachine.getMachineAttributes()) {
                System.out.println("- Attribut: " + attr.getAttributeName() + " (" + attr.getAttributeType() + ")");
            }

            // Security Context clearen
            SecurityContextHolder.clearContext();
            System.out.println("Security Context zurückgesetzt");

            System.out.println("Test-Daten initialisiert!");
        };
    }
}