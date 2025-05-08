package com.example.machine_management.controller;

import com.example.machine_management.dto.AttributeTemplateDto;
import com.example.machine_management.mapper.AttributeTemplateMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.repository.AttributeTemplateRepository;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.models.MachineTemplate;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attribute-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class AttributeInTemplateController {
    //hier geht es jetzt nur um das NACHTRÄGLICHE hinzufügen von attributen über die frontend seite 
    //machien template bearbeiten 
    //es ist nicht möglich die attributeInTemplates anderweitig zu erstellen

    @Autowired
    private AttributeTemplateRepository attributeTemplateRepository;

    @Autowired
    private MachineTemplateRepository machineTemplateRepository;

    //das bedeutet dass wir hier das neue attributInTempalte direkt in das template schreiben 
    @PostMapping
    public ResponseEntity<?> createAttributeTemplate(@RequestBody AttributeTemplateDto dto) {
        System.out.println("in poszt controller "+ dto.id+ " " + dto.attributeInTemplateName+ " " + dto.attributeInTemplateName);
        return machineTemplateRepository.findById(dto.id)   //template finden 
            .<ResponseEntity<?>>map(machineTemplate -> {    //durch das template iterieren
                // das neue attributeInTemplate erstellen
                AttributeInTemplate attributeInTemplate = new AttributeInTemplate();
                attributeInTemplate.setAttributeInTemplateName(dto.attributeInTemplateName);
                attributeInTemplate.setType(AttributeType.valueOf(dto.attributeInTemplateType));
                attributeInTemplate.setMachineTemplate(machineTemplate);    //hier das existierende template 


                AttributeInTemplate saved = attributeTemplateRepository.save(attributeInTemplate); //versuchen es zu persistieren, speichern
                return ResponseEntity.ok(AttributeTemplateMapper.toDto(saved));
            })
            .orElseGet(() ->    //hier wurde kein template gefunden
                ResponseEntity.status(HttpStatus.NOT_FOUND)     
                    .body("Maschinen-Template mit ID " + dto.id + " nicht gefunden.")
            );
    }

    @GetMapping
    public ResponseEntity<List<AttributeTemplateDto>> getAllAttributeTemplates() {
        List<AttributeTemplateDto> result = attributeTemplateRepository.findAll()
            .stream()
            .map(AttributeTemplateMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return attributeTemplateRepository.findById(id)
            .<ResponseEntity<?>>map(template -> ResponseEntity.ok(AttributeTemplateMapper.toDto(template)))
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attribute-Template mit ID " + id + " nicht gefunden.")
            );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttributeTemplate(@PathVariable Integer id) {
        if (!attributeTemplateRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Attribute-Template mit ID " + id + " nicht gefunden.");
        }
        attributeTemplateRepository.deleteById(id);
        return ResponseEntity.ok("Template gelöscht.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttributeTemplate(@PathVariable Integer id, @RequestBody AttributeTemplateDto dto) {
        return attributeTemplateRepository.findById(id)
            .<ResponseEntity<?>>map(template -> {
                template.setAttributeInTemplateName(dto.attributeInTemplateName);
                template.setType(AttributeType.valueOf(dto.attributeInTemplateType));
                AttributeInTemplate updated = attributeTemplateRepository.save(template);
                return ResponseEntity.ok(AttributeTemplateMapper.toDto(updated));
            })
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attribute-Template mit ID " + id + " nicht gefunden.")
            );
    }
}
