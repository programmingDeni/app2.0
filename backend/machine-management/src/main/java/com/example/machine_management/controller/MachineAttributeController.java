package com.example.machine_management.controller;

import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
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

    private final MachineAttributeService attributeService;
    private final MachineAttributeMapper machineAttributeMapper;

    @Autowired
    public MachineAttributeController(MachineAttributeService attributeService,
            MachineAttributeMapper machineAttributeMapper) {
        this.attributeService = attributeService;
        this.machineAttributeMapper = machineAttributeMapper;
    }

    // POST fügt Machine ein Attribute hinzu
    // jetzt in machine controller
    /*
     * @PostMapping
     * public ResponseEntity<MachineAttributeDto> createAttribute(@RequestBody
     * MachineAttributeDto dto) {
     * // 1. Validate
     * if (dto == null || !isValidAttributeDto(dto)) {
     * throw new IllegalArgumentException("Invalid attribute data");
     * }
     * 
     * // 2. Create entity
     * MachineAttribute created = attributeService.createMachineAttribute(dto);
     * 
     * // 3. Map and return
     * return ResponseEntity.status(HttpStatus.CREATED)
     * .body(MachineAttributeMapper.toDto(created));
     * }
     */

    @GetMapping
    public ResponseEntity<List<MachineAttributeDto>> getAllAttributesLazy() {
        // 1. Get entities
        List<MachineAttribute> attributes = attributeService.findAll();
        // 2. Map and return
        return ResponseEntity.ok(attributes.stream()
                .map(machineAttributeMapper::toDtoLazy)
                .collect(Collectors.toList()));
    }

    @GetMapping("/eager")
    public ResponseEntity<List<MachineAttributeDto>> getAllAttributesEager() {
        // 1. Get entities
        List<MachineAttribute> attributes = attributeService.findAll();
        // 2. Map and return
        return ResponseEntity.ok(attributes.stream()
                .map(machineAttributeMapper::toDtoEager)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineAttributeDto> getAttributeById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity
        MachineAttribute attribute = attributeService.findById(id);

        // 3. Map and return
        return ResponseEntity.ok(machineAttributeMapper.toDtoEager(attribute));
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
        MachineAttribute updated = attributeService.update(id, dto);

        // 3. Map and return
        return ResponseEntity.ok(machineAttributeMapper.toDtoLazy(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttribute(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete
        attributeService.delete(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-machine/{machineId}")
    public ResponseEntity<List<MachineAttributeDto>> getAttributesByMachineId(@PathVariable Integer machineId) {
        // 1. Validate
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("Invalid machine ID");
        }

        // 2. Get entities
        List<MachineAttribute> attributes = attributeService.findByMachineId(machineId);

        // 3. Map and return
        return ResponseEntity.ok(machineAttributeMapper.toDtoListLazy(attributes));

    }

    private boolean isValidAttributeDto(MachineAttributeDto dto) {
        return dto.attributeName != null &&
                !dto.attributeName.trim().isEmpty() &&
                dto.attributeType != null &&
                dto.machineId > 0;
    }
}