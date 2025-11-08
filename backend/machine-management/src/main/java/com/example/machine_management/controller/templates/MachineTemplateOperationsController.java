package com.example.machine_management.controller.templates;

import com.example.machine_management.controller.base.AbstractMachineBaseController;
import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.mapper.LazyMachineMapper;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.mapper.MachineStructureMapper;
import com.example.machine_management.models.Machine;
import com.example.machine_management.services.machine.MachineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/machines")
public class MachineTemplateOperationsController extends AbstractMachineBaseController {

    private final MachineService machineService;
    private final MachineMapper machineMapper;
    private final MachineStructureMapper machineStructureMapper;

    @Autowired
    public MachineTemplateOperationsController(MachineService machineService, MachineMapper machineMapper,
            MachineStructureMapper machineStructureMapper) {
        this.machineService = machineService;
        this.machineMapper = machineMapper;
        this.machineStructureMapper = machineStructureMapper;
    }

    @PostMapping("/from-template")
    public ResponseEntity<LazyMachineDto> createMachineFromTemplate(
            @RequestBody CreateMachineFromTemplateDto dto) {
        if (dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid template data");
        }

        Machine created = machineService.createMachineFromTemplate(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(LazyMachineMapper.toDto(created));
    }

    @GetMapping("/{id}/structure")
    public ResponseEntity<MachineStructureDto> getMachineStructure(@PathVariable Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        Machine machine = machineService.findById(id);
        return ResponseEntity.ok(machineStructureMapper.toDto(machine));
    }

    @PutMapping("/{id}/template/{templateId}")
    public ResponseEntity<MachineDto> assignTemplateToMachine(
            @PathVariable("id") Integer machineId,
            @PathVariable Integer templateId) {
        if (machineId == null || machineId <= 0 || templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }

        return ResponseEntity.ok(machineMapper.toDto(
                machineService.assignTemplate(machineId, templateId)));
    }

    @DeleteMapping("/{id}/template")
    public ResponseEntity<Void> removeTemplateFromMachine(@PathVariable("id") Integer machineId) {
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        machineService.removeTemplateFromMachine(machineId);
        return ResponseEntity.noContent().build();
    }
}