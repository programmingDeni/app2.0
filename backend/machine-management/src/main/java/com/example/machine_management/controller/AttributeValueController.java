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

    private final AttributeValueService attributeValueService;
    private final AttributeValueMapper attributeValueMapper;

    @Autowired
    public AttributeValueController(
            AttributeValueService attributeValueService,
            AttributeValueMapper attributeValueMapper) {
        this.attributeValueService = attributeValueService;
        this.attributeValueMapper = attributeValueMapper;
    }

    @PostMapping
    public ResponseEntity<AttributeValueDto> createAttributeValue(@RequestBody CreateAttributeValueDto dto) {
        // Attribute Values werden nur aus einem bestehenden Attribut heraus erstellt.

        // 1. Validate
        if (dto == null) {
            throw new IllegalArgumentException("Invalid attribute value data");
        }

        // 2. Call service & get entity
        AttributeValue created = attributeValueService.createAttributeValue(dto);

        // 3. Map to DTO and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attributeValueMapper.toDto(created));

    }

    @GetMapping
    public ResponseEntity<List<AttributeValueDto>> getAllAttributeValues() {
        // 1. Get entities (uses inherited method with userId filtering)
        List<AttributeValue> values = attributeValueService.findAll();

        // 2. Map and return
        return ResponseEntity.ok(values.stream()
                .map(attributeValueMapper::toDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeValueDto> getById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity (uses inherited method with userId filtering)
        AttributeValue value = attributeValueService.findById(id);

        // 3. Map and return
        return ResponseEntity.ok(attributeValueMapper.toDto(value));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttributeValueDto> updateAttributeValue(
            @PathVariable Integer id,
            @RequestBody AttributeValueDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidValueDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update using specialized method (has year-based logic)
        AttributeValue updated = attributeValueService.updateAttributeValue(dto);

        // 3. Map and return
        return ResponseEntity.ok(attributeValueMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeValue(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete (uses inherited method with userId filtering)
        attributeValueService.delete(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    private boolean isValidValueDto(AttributeValueDto dto) {
        return dto.attributeValue != null &&
                !dto.attributeValue.trim().isEmpty() &&
                dto.machineAttributeId > 0;
    }
}