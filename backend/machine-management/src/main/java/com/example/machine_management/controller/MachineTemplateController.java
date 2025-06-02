// MachineTemplateController.java
package com.example.machine_management.controller;

import com.example.machine_management.dto.*;
import com.example.machine_management.services.MachineTemplateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.mapper.MachineStructureMapper;
import com.example.machine_management.mapper.MachineTemplateMapper;

@RestController
@RequestMapping("/api/machine-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineTemplateController {

    @Autowired
    private MachineTemplateService templateService;

    @PostMapping
    public ResponseEntity<MachineTemplateDto> createTemplate(@RequestBody MachineTemplateDto dto) {
        // 1. Validate
        if (dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid template data");
        }

        // 2. Create entity
        MachineTemplate created = templateService.createTemplate(dto);

        // 3. Map and return
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(MachineTemplateMapper.toDto(created));
    }

    @PostMapping("/with-attributes")
    public ResponseEntity<CreateMachineTemplateWithAttributesDto> createTemplateWithAttributes(@RequestBody CreateMachineTemplateWithAttributesDto dto) {
        // 1. Validate
        if (dto == null) {
            throw new IllegalArgumentException("Invalid template data");
        }

        // 2. Create entity
        MachineTemplate created = templateService.createTemplateWithAttributes(dto);

        // 3. Map and return
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(MachineTemplateMapper.toWithAttributesDto(created));
    }

    //  lazy loading
    @GetMapping("lazy")
    public ResponseEntity<List<MachineTemplateDto>> getAllTemplates() {
        // 1. Get entities
        List<MachineTemplate> templates = templateService.getAllTemplatesLazy();

        // 2. Map and return
        return ResponseEntity.ok(templates.stream()
            .map(MachineTemplateMapper::toDtoLazy)
            .collect(Collectors.toList()));
    }

    @GetMapping("full")
    public ResponseEntity<List<MachineTemplateDto>> getAllTemplatesWithAttributes() {
        // 1. Get entities
        List<MachineTemplate> templates = templateService.getAllTemplatesWithAttributes();

        // 2. Map and return
        return ResponseEntity.ok(templates.stream()
            .map(MachineTemplateMapper::toDto)
            .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> getTemplateById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity
        MachineTemplate template = templateService.getTemplateById(id);

        // 3. Map and return
        return ResponseEntity.ok(MachineTemplateMapper.toDto(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> updateTemplate(
            @PathVariable Integer id,
            @RequestBody MachineTemplateDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update entity
        MachineTemplate updated = templateService.updateTemplate(id, dto);

        // 3. Map and return
        return ResponseEntity.ok(MachineTemplateMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete
        templateService.deleteTemplate(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    private boolean isValidTemplateDto(MachineTemplateDto dto) {
        return dto.templateName != null && !dto.templateName.trim().isEmpty();
    }
}