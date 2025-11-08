package com.example.machine_management.controller;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.mapper.AttributeTemplateMapper;
import com.example.machine_management.models.TemplateAttribute;
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

    private final AttributeTemplateService attributeTemplateService;
    private final AttributeTemplateMapper attributeTemplateMapper;

    @Autowired
    public AttributeInTemplateController(
            AttributeTemplateService attributeTemplateService,
            AttributeTemplateMapper attributeTemplateMapper) {
        this.attributeTemplateService = attributeTemplateService;
        this.attributeTemplateMapper = attributeTemplateMapper;
    }

    @PostMapping
    public ResponseEntity<AttributeTemplateDto> createAttributeTemplate(@RequestBody AttributeTemplateDto dto) {
        // 1. Validate input
        if (dto == null || !isValidAttributeTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid attribute template data");
        }

        // 2. Call service
        TemplateAttribute created = attributeTemplateService.createOneForTemplate(dto);

        // 3. Convert and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attributeTemplateMapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<AttributeTemplateDto>> getAllAttributeTemplates() {
        // 1. Get data from service (uses inherited findAll method)
        List<TemplateAttribute> templates = attributeTemplateService.findAll();

        // 2. Convert and return
        List<AttributeTemplateDto> dtos = attributeTemplateMapper.toDtoList(templates);

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
        List<TemplateAttribute> attributes = attributeTemplateService.getByMachineTemplateId(templateId);

        // 3. Convert and return
        List<AttributeTemplateDto> dtos = attributeTemplateMapper.toDtoList(attributes);

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeTemplateDto> getById(@PathVariable Integer id) {
        // 1. Validate input
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get data from service
        TemplateAttribute template = attributeTemplateService.findById(id);

        // 3. Convert and return
        return ResponseEntity.ok(attributeTemplateMapper.toDto(template));
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
        TemplateAttribute updated = attributeTemplateService.updateAttributeTemplate(id, dto);

        // 3. Convert and return
        return ResponseEntity.ok(attributeTemplateMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeTemplate(@PathVariable Integer id) {
        // 1. Validate input
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete via service
        attributeTemplateService.delete(id);

        // 3. Return success response
        return ResponseEntity.noContent().build();
    }

    private boolean isValidAttributeTemplateDto(AttributeTemplateDto dto) {
        return dto.templateAttributeName != null &&
                !dto.templateAttributeName.trim().isEmpty() &&
                dto.templateAttributeType != null &&
                dto.machineTemplateId > 0;
    }
}