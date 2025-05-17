package com.example.machine_management.controller;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.services.MachineAttributeService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/machine-attributes")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineAttributeController {

    @Autowired
    private MachineAttributeService attributeService;

    @PostMapping
    public ResponseEntity<MachineAttributeDto> createAttribute(@RequestBody MachineAttributeDto dto) {
        // 1. Validate
        if (dto == null || !isValidAttributeDto(dto)) {
            throw new IllegalArgumentException("Invalid attribute data");
        }

        // 2. Create entity
        MachineAttribute created = attributeService.createMachineAttribute(dto);

        // 3. Map and return
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(MachineAttributeMapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<MachineAttributeDto>> getAllAttributes() {
        // 1. Get entities
        List<MachineAttribute> attributes = attributeService.getAllAttributes();

        // 2. Map and return
        return ResponseEntity.ok(attributes.stream()
            .map(MachineAttributeMapper::toDto)
            .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineAttributeDto> getAttributeById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity
        MachineAttribute attribute = attributeService.getAttributeById(id);

        // 3. Map and return
        return ResponseEntity.ok(MachineAttributeMapper.toDto(attribute));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineAttributeDto> updateAttribute(
            @PathVariable Integer id,
            @RequestBody MachineAttributeDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidAttributeDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update entity
        MachineAttribute updated = attributeService.updateAttribute(id, dto);

        // 3. Map and return
        return ResponseEntity.ok(MachineAttributeMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttribute(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete
        attributeService.deleteAttribute(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    private boolean isValidAttributeDto(MachineAttributeDto dto) {
        return dto.attributeName != null && 
               !dto.attributeName.trim().isEmpty() &&
               dto.attributeType != null &&
               dto.machineId > 0;
    }
}