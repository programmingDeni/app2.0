package com.example.machine_management.controller.machines;

import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.mapper.LazyMachineMapper;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.services.machine.MachineService;
import com.example.machine_management.services.machine.MachineTemplateOperationsService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Template Operations", description = "Special operations for templates (create:Post to: 'api/machines/from-template', assign: post to: 'api/machines/{machineId}/template/{templateId}', remove: delete to: 'api/machines/{machineId}/template')")
@RequestMapping("/api/machines")
public class MachineTemplateOperationsController  {

    private final MachineService machineService;
    private final MachineMapper machineMapper;
    private final MachineTemplateOperationsService machineTemplateOperationsService;

    @Autowired
    public MachineTemplateOperationsController(MachineService machineService, MachineMapper machineMapper,
    MachineTemplateOperationsService machineTemplateOperationsService) {
        this.machineService = machineService;
        this.machineMapper = machineMapper;
        this.machineTemplateOperationsService = machineTemplateOperationsService;
    }

    @PostMapping("/from-template")
    public ResponseEntity<LazyMachineDto> createMachineFromTemplate(
            @RequestBody CreateMachineFromTemplateDto dto) {
        if (dto == null || dto.machineTemplateId == null || dto.machineTemplateId <= 0) {
            throw new IllegalArgumentException("Invalid template data");
        }

        Machine created = machineTemplateOperationsService.createMachineFromTemplate(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(LazyMachineMapper.toDto(created));
    }

    @PutMapping("/{id}/template/{templateId}")
    public ResponseEntity<MachineDto> assignTemplateToMachine(
            @PathVariable("id") Integer machineId,
            @PathVariable Integer templateId) {
        if (machineId == null || machineId <= 0 || templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }

        return ResponseEntity.ok(machineMapper.toDto(
                machineTemplateOperationsService.assignTemplate(machineId, templateId)));
    }

    @DeleteMapping("/{id}/template")
    public ResponseEntity<Void> removeTemplateFromMachine(@PathVariable("id") Integer machineId) {
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        machineTemplateOperationsService.removeTemplateFromMachine(machineId);
        return ResponseEntity.noContent().build();
    }
}