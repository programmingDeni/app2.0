package com.example.machine_management.controller.machines;

import com.example.machine_management.controller.base.AbstractMachineBaseController;
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.MachineAttribute;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/machines")
public class MachineAttributeOperationsController extends AbstractMachineBaseController {

    @PostMapping("/{id}/attributes")
    public ResponseEntity<MachineAttributeDto> createAttribute(
            @PathVariable Integer id,
            @RequestBody CreateMachineAttributeDto dto) {
        if (dto == null || !isValidMachineAttributeDto(dto)) {
            throw new IllegalArgumentException("Invalid attribute data");
        }
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        MachineAttribute created = machineService.addMachineAttribute(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(MachineAttributeMapper.toDto(created));
    }

    @PutMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<MachineAttributeDto> editMachineAttribute(
            @PathVariable("id") Integer machineId,
            @PathVariable Integer attributeId,
            @RequestBody MachineAttributeDto dto) {
        if (machineId == null || machineId <= 0 || attributeId == null || attributeId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }

        MachineAttribute updated = machineService.editMachineAttribute(machineId, attributeId, dto);
        return ResponseEntity.ok(MachineAttributeMapper.toDto(updated));
    }

    @DeleteMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<Void> removeMachineAttribute(
            @PathVariable Integer id,
            @PathVariable Integer attributeId) {
        if (id == null || id <= 0 || attributeId == null || attributeId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }

        machineService.removeMachineAttribute(id, attributeId);
        return ResponseEntity.noContent().build();
    }
}