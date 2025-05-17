package com.example.machine_management.controller;

import com.example.machine_management.dto.AttributeTemplateDto;
import com.example.machine_management.mapper.AttributeTemplateMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.repository.AttributeTemplateRepository;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.services.AttributeTemplateService;
import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;
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

    @Autowired
    private AttributeTemplateService attributeTemplateService;
    
    @PostMapping
    public ResponseEntity<AttributeTemplateDto> createAttributeTemplate(@RequestBody AttributeTemplateDto dto) {
        // 1. Validate input
        if (dto == null || !isValidAttributeTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid attribute template data");
        }

        // 2. Call service
        AttributeInTemplate created = attributeTemplateService.createOneForTemplate(dto);

        // 3. Convert and return
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(AttributeTemplateMapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<AttributeTemplateDto>> getAllAttributeTemplates() {
        // 1. Get data from service
        List<AttributeInTemplate> templates = attributeTemplateService.getAllAttributeTemplates();
        
        // 2. Convert and return
        List<AttributeTemplateDto> dtos = AttributeTemplateMapper.toDtoList(templates);
            
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/by-template/{templateId}")
    public ResponseEntity<List<AttributeTemplateDto>> getByMachineTemplateId(
            @PathVariable Integer templateId) {
        // 1. Validate input
        if (templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Invalid template ID");
        }

        // 2. Get data from service
        List<AttributeInTemplate> attributes = attributeTemplateService.getByMachineTemplateId(templateId);

        // 3. Convert and return
        List<AttributeTemplateDto> dtos = AttributeTemplateMapper.toDtoList(attributes);

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeTemplateDto> getById(@PathVariable Integer id) {
        // 1. Validate input
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get data from service
        AttributeInTemplate template = attributeTemplateService.getById(id);

        // 3. Convert and return
        return ResponseEntity.ok(AttributeTemplateMapper.toDto(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttributeTemplateDto> updateAttributeTemplate(
            @PathVariable Integer id,
            @RequestBody AttributeTemplateDto dto) {
        // 1. Validate input
        if (id == null || id <= 0 || dto == null || !isValidAttributeTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update via service
        AttributeInTemplate updated = attributeTemplateService.updateAttributeTemplate(id, dto);

        // 3. Convert and return
        return ResponseEntity.ok(AttributeTemplateMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeTemplate(@PathVariable Integer id) {
        // 1. Validate input
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete via service
        attributeTemplateService.deleteAttributeTemplate(id);

        // 3. Return success response
        return ResponseEntity.noContent().build();
    }

    private boolean isValidAttributeTemplateDto(AttributeTemplateDto dto) {
        return dto.attributeInTemplateName != null && 
               !dto.attributeInTemplateName.trim().isEmpty() &&
               dto.attributeInTemplateType != null &&
               dto.machineTemplateId > 0;
    }
}