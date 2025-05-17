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

    @GetMapping
    public ResponseEntity<List<MachineDto>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }    

    @GetMapping("/{id}")
    public ResponseEntity<MachineDto> getMachine(@PathVariable Integer id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @PostMapping
    public ResponseEntity<MachineDto> createMachine(@RequestBody MachineDto machineDto) {
        return ResponseEntity.ok(machineService.createMachine(machineDto));
    }

    @PostMapping("/from-template")
    public ResponseEntity<MachineDto> createMachineFromTemplate(@RequestBody CreateMachineFromTemplateDto dto) {
        MachineDto created = machineService.createMachineFromTemplate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PutMapping("/{id}")
    public ResponseEntity<MachineDto> updateMachine(
            @PathVariable Integer id, 
            @RequestBody MachineDto machineDto) {
        return ResponseEntity.ok(machineService.updateMachine(id, machineDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Integer id) {
        machineService.deleteMachine(id);
        return ResponseEntity.ok().build();
    }
}

