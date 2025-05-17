package com.example.machine_management.controller;

import com.example.machine_management.dto.AttributeValueDto;
import com.example.machine_management.services.AttributeValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attribute-values")
@CrossOrigin(origins = "http://localhost:3000")
public class AttributeValueController {

    @Autowired
    private AttributeValueService attributeValueService;

    @PostMapping
    public ResponseEntity<AttributeValueDto> createAttributeValue(@RequestBody AttributeValueDto dto) {
        return ResponseEntity.ok(attributeValueService.createOrUpdateAttributeValue(dto));
    }

    @GetMapping
    public ResponseEntity<List<AttributeValueDto>> getAllAttributeValues() {
        return ResponseEntity.ok(attributeValueService.getAllAttributeValues());
    }

    @GetMapping("/by-attribute/{attributeId}")
    public ResponseEntity<List<AttributeValueDto>> getByMachineAttributeId(@PathVariable Integer attributeId) {
        return ResponseEntity.ok(attributeValueService.getAttributeValuesByMachineAttributeId(attributeId));
    }

    @GetMapping("/by-year/{year}")
    public ResponseEntity<List<AttributeValueDto>> getAttributeValuesByYear(@PathVariable Integer year) {
        return ResponseEntity.ok(attributeValueService.getAttributeValuesByYear(year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttributeValueDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(attributeValueService.getAttributeValueById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeValue(@PathVariable Integer id) {
        attributeValueService.deleteAttributeValue(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttributeValueDto> updateAttributeValue(
            @PathVariable Integer id, 
            @RequestBody AttributeValueDto dto) {
        return ResponseEntity.ok(attributeValueService.createOrUpdateAttributeValue(dto));
    }
}