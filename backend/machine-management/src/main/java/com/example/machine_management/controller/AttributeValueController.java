package com.example.machine_management.controller;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.dto.AttributeValue.CreateAttributeValueDto;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.services.AttributeValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attribute-values")
@CrossOrigin(origins = "http://localhost:3000")
public class AttributeValueController {

    @Autowired
    private AttributeValueService attributeValueService;

    @PostMapping
    public ResponseEntity<AttributeValueDto> createAttributeValue(@RequestBody CreateAttributeValueDto dto) {
        // Attribute Values werden nur aus einem bestehenden Attribut heraus erstellt.

        // 1. Validate // mehr valiudation?
        if (dto == null) {
            throw new IllegalArgumentException("Invalid attribute value data");
        }

        // 2. Call service & get entity
        AttributeValue created = attributeValueService.createAttributeValue(dto);

        // 3. Map to DTO and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AttributeValueMapper.toDto(created));

    }

    @GetMapping
    public ResponseEntity<List<AttributeValueDto>> getAllAttributeValues() {
        // 1. Get entities
        List<AttributeValue> values = attributeValueService.getAllAttributeValues();

        // 2. Map and return
        return ResponseEntity.ok(values.stream()
                .map(AttributeValueMapper::toDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeValueDto> getById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity
        AttributeValue value = attributeValueService.getAttributeValueById(id);

        // 3. Map and return
        return ResponseEntity.ok(AttributeValueMapper.toDto(value));
    }

    @GetMapping("/by-attribute/{attributeId}")
    public ResponseEntity<List<AttributeValueDto>> getByAttributeId(@PathVariable Integer attributeId) {
        // 1. Validate
        if (attributeId == null || attributeId <= 0) {
            throw new IllegalArgumentException("Invalid attribute ID");
        }

        // 2. Get entities
        List<AttributeValue> values = attributeValueService.getAttributeValuesByMachineAttributeId(attributeId);

        // 3. Map and return
        return ResponseEntity.ok(values.stream()
                .map(AttributeValueMapper::toDto)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttributeValueDto> updateAttributeValue(
            @PathVariable Integer id,
            @RequestBody AttributeValueDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidValueDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update and get entity
        AttributeValue updated = attributeValueService.updateAttributeValue(dto);

        // 3. Map and return
        return ResponseEntity.ok(AttributeValueMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeValue(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete
        attributeValueService.deleteAttributeValue(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    private boolean isValidValueDto(AttributeValueDto dto) {
        return dto.attributeValue != null &&
                !dto.attributeValue.trim().isEmpty() &&
                dto.machineAttributeId > 0;
    }
}