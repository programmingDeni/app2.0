package com.example.machine_management.controller;

import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineRepository;

import java.util.List;

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
    private MachineRepository machineRepository;

    @GetMapping
    public ResponseEntity<?> getAllMachines() {
        try {
            List<Machine> machines = machineRepository.findAll();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }
    }    

    @PostMapping
    public ResponseEntity<?> createMachine(@RequestBody Machine machine) {
        try {
            Machine saved = machineRepository.save(machine);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Fehler beim hinzufuegen: " + e.getClass().getSimpleName()); 
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMachine(@PathVariable Integer id, @RequestBody Machine updatedMachine) {
        return machineRepository.findById(id)
            .map(machine -> {
                String newName = updatedMachine.getName();
                if (newName == null || newName.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body("Maschinenname darf nicht leer sein.");
                }
                machine.setName(newName);
                return ResponseEntity.ok(machineRepository.save(machine));
            })
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Maschine mit ID " + id + " nicht gefunden.")
            );
    }

    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMachine(@PathVariable Integer id) {
        if (!machineRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Maschine mit ID " + id + " nicht gefunden.");
        }

        machineRepository.deleteById(id);
        return ResponseEntity.ok("Maschine mit ID " + id + " wurde gelöscht.");
    }



}
