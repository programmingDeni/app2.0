package com.example.machine_management.controller.machines;

import com.example.machine_management.controller.base.AbstractMachineBaseController;
import com.example.machine_management.models.Machine;
import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.mapper.LazyMachineMapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller für grundlegende CRUD-Operationen auf Maschinen.
 * Template- und Attribut-bezogene Operationen sind in separaten Controllern.
 */
@RestController
@RequestMapping("/api/machines")
public class MachineController extends AbstractMachineBaseController {

    /**
     * Erstellt eine neue Maschine.
     */
    @PostMapping
    public ResponseEntity<MachineDto> createMachine(@RequestBody MachineDto dto) {
        if (dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid machine data");
        }

        Machine created = machineService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(machineMapper.toDto(created));
    }

    /**
     * Ruft alle Maschinen im Lazy-Loading-Modus ab.
     * Lädt nur Basis-Informationen, keine Attribute oder Template-Details.
     */
    @GetMapping("/lazy")
    public ResponseEntity<List<LazyMachineDto>> getAllMachinesLazy() {
        List<Machine> machines = machineService.findAll();
        List<LazyMachineDto> dtos = LazyMachineMapper.toDtoList(machines);
        return ResponseEntity.ok(dtos);
    }

    /**
     * Ruft alle Maschinen mit vollständigen Details ab.
     * Inkludiert Attribute und Template-Informationen.
     */
    @GetMapping
    public ResponseEntity<List<MachineDto>> getAllMachines() {
        List<Machine> machines = machineService.findAll();
        List<MachineDto> dtos = machines.stream()
                .map(machineMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Ruft eine spezifische Maschine anhand ihrer ID ab.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MachineDto> getMachine(@PathVariable Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        Machine machine = machineService.findById(id);
        return ResponseEntity.ok(machineMapper.toDto(machine));
    }

    /**
     * Aktualisiert die Basis-Informationen einer Maschine.
     * Für Template- oder Attribut-Änderungen existieren separate Endpunkte.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MachineDto> updateMachine(
            @PathVariable Integer id,
            @RequestBody MachineDto dto) {
        if (id == null || id <= 0 || dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        Machine updated = machineService.update(id, dto);
        return ResponseEntity.ok(machineMapper.toDto(updated));
    }

    /**
     * Löscht eine Maschine und alle zugehörigen Daten.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        machineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}