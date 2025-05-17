package com.example.machine_management.controller;

import com.example.machine_management.dto.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.MachineDto;
import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.services.MachineService;
import com.example.machine_management.mapper.MachineMapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @PostMapping
    public ResponseEntity<MachineDto> createMachine(@RequestBody MachineDto dto) {
        // 1. Validate
        if (dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid machine data");
        }

        // 2. Call service & get entity
        Machine created = machineService.createMachine(dto);

        // 3. Map to DTO and return
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(MachineMapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<MachineDto>> getAllMachines() {
        // 1. Get entities from service
        List<Machine> machines = machineService.getAllMachines();
        
        // 2. Map to DTOs and return
        List<MachineDto> dtos = machines.stream()
            .map(MachineMapper::toDto)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineDto> getMachine(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity from service
        Machine machine = machineService.getMachineById(id);

        // 3. Map to DTO and return
        return ResponseEntity.ok(MachineMapper.toDto(machine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineDto> updateMachine(
            @PathVariable Integer id, 
            @RequestBody MachineDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update via service & get entity
        Machine updated = machineService.updateMachine(id, dto);

        // 3. Map to DTO and return
        return ResponseEntity.ok(MachineMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete via service
        machineService.deleteMachine(id);

        // 3. Return success response
        return ResponseEntity.noContent().build();
    }

    private boolean isValidMachineDto(MachineDto dto) {
        return dto.name != null && !dto.name.trim().isEmpty();
    }
}