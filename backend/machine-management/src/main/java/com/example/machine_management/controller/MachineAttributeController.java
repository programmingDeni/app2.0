package com.example.machine_management.controller;

import com.example.machine_management.dto.MachineAttributeDto;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttributes;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.models.AttributeType;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attributes")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineAttributeController {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineAttributeRepository attributeRepository;

    @GetMapping
    public ResponseEntity<?> getAllAttributes() {
        List<MachineAttributes> attributes = attributeRepository.findAll();
        List<MachineAttributeDto> dtoList = attributes.stream()
            .map(MachineAttributeMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttributeById(@PathVariable Integer id) {
        Optional<MachineAttributes> attribute = attributeRepository.findById(id);
        return attribute
            .<ResponseEntity<?>>map(attr -> ResponseEntity.ok(MachineAttributeMapper.toDto(attr)))
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attribut mit ID " + id + " nicht gefunden.")
            );
    }

    @PostMapping
    public ResponseEntity<?> addAttribute(@RequestBody MachineAttributeDto request) {
        System.out.println("Request erhalten: " + request.attributeName + ", " + request.machineId + ", " + request.attributeType);
        return machineRepository.findById(request.machineId)    //finde machine deren attribute gepostet werden soll
            .<ResponseEntity<?>>map(machine -> {
                MachineAttributes attr = new MachineAttributes();       //erstelle die neuen attribute
                attr.setAttributeName(request.attributeName);
                attr.setMachine(machine);
                attr.setType(AttributeType.valueOf(request.attributeType));
                attr.setAttributeValue(request.attributeValue);
                MachineAttributes saved = attributeRepository.save(attr);
                return ResponseEntity.ok(MachineAttributeMapper.toDto(saved));
            })
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Maschine mit ID " + request.machineId + " nicht gefunden.")
            );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttribute(@PathVariable Integer id, @RequestBody MachineAttributeDto request) {
        return attributeRepository.findById(id)
            .<ResponseEntity<?>>map(attr -> {
                attr.setAttributeName(request.attributeName);
                attr.setType(AttributeType.valueOf(request.attributeType));
                attr.setAttributeValue(request.attributeValue);
                MachineAttributes saved = attributeRepository.save(attr);
                return ResponseEntity.ok(MachineAttributeMapper.toDto(saved));
            })
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attribut mit ID " + id + " nicht gefunden.")
            );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(@PathVariable Integer id) {
        if (!attributeRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Attribut mit ID " + id + " nicht gefunden.");
        }
        attributeRepository.deleteById(id);
        return ResponseEntity.ok("Attribut mit ID " + id + " wurde gelöscht.");
    }
}
