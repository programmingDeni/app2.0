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
    private MachineAttributeService machineAttributeService;

    @GetMapping
    public List<MachineAttributeDto> getAllAttributes() {
        return machineAttributeService.getAllAttributes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttributeById(@PathVariable Integer id) {
        return ResponseEntity.ok(machineAttributeService.getAttributeById(id));
    }

    @PostMapping
    public ResponseEntity<?> createMachineAttribute(@RequestBody MachineAttributeDto machineAttributeDto) {
        return ResponseEntity.ok(machineAttributeService.createMachineAttribute(machineAttributeDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttribute(@PathVariable Integer id, @RequestBody MachineAttributeDto dto) {
        return ResponseEntity.ok(machineAttributeService.updateAttribute(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(@PathVariable Integer id) {
        machineAttributeService.deleteAttribute(id);
        return ResponseEntity.ok("Machine Attribut mit id" + id + "Gelöscht");
    }
}
