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
        return ResponseEntity.ok(attributeTemplateService.createOneForTemplate(dto));
    }

    @GetMapping
    public ResponseEntity<List<AttributeTemplateDto>> getAllAttributeTemplates() {
        return ResponseEntity.ok(attributeTemplateService.getAllAttributeTemplates());
    }

    @GetMapping("/by-template/{templateId}")
    public ResponseEntity<List<AttributeTemplateDto>> getByMachineTemplateId(@PathVariable Integer templateId) {
        return ResponseEntity.ok(attributeTemplateService.getByMachineTemplateId(templateId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeTemplateDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(attributeTemplateService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeTemplate(@PathVariable Integer id) {
        attributeTemplateService.deleteAttributeTemplate(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttributeTemplateDto> updateAttributeTemplate(
            @PathVariable Integer id, 
            @RequestBody AttributeTemplateDto dto) {
        return ResponseEntity.ok(attributeTemplateService.updateAttributeTemplate(id, dto));
    }
}