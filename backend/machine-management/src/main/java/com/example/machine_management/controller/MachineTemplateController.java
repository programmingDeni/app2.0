// MachineTemplateController.java
package com.example.machine_management.controller;

import com.example.machine_management.dto.*;
import com.example.machine_management.mapper.MachineTemplateMapper;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineTemplateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machine-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineTemplateController {

    @Autowired
    private MachineTemplateRepository templateRepo;

    @GetMapping
    public ResponseEntity<?> getAllTemplates() {
        List<MachineTemplate> templates = templateRepo.findAll();
        List<MachineTemplateDto> dtos = templates.stream()
            .map(MachineTemplateMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTemplateById(@PathVariable Integer id) {
        return templateRepo.findById(id)
            .<ResponseEntity<?>>map(template -> ResponseEntity.ok(MachineTemplateMapper.toDto(template)))
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Template mit ID " + id + " nicht gefunden.")
            );
    }

    @PostMapping
    public ResponseEntity<?> createTemplate(@RequestBody MachineTemplateDto dto) {
        System.out.println("Request erhalten: " + dto.templateName + ", " + dto.attributeTemplates);
        MachineTemplate entity = MachineTemplateMapper.fromDto(dto);
        System.out.println("Entity erstellt: " + entity);
        MachineTemplate saved = templateRepo.save(entity);
        return ResponseEntity.ok(MachineTemplateMapper.toDto(saved));
    }
}
