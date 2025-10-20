package com.example.machine_management.controller.machines;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.Machine;
import com.example.machine_management.services.AttributeValueService;

import org.springframework.web.bind.annotation.*;

import com.example.machine_management.controller.base.AbstractMachineBaseController;

@RestController
@RequestMapping("/api/machines/")
public class MachineAttributeValueOperationsController extends AbstractMachineBaseController {

    private final AttributeValueService attributeValueService;

    @Autowired
    public MachineAttributeValueOperationsController(AttributeValueService attributeValueService) {
        this.attributeValueService = attributeValueService;
    }

        @GetMapping("/{machineId}/attribute-values")
    public ResponseEntity<List<AttributeValueDto>> getMachineAttributes(
            @PathVariable Integer machineId) {
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        //TEST 
        Machine machine = machineService.findById(machineId);

        List<AttributeValue> attributeValues = attributeValueService.getAttributeValuesByMachineId(machineId);
        List<AttributeValueDto> attributeValueDtos = attributeValues.stream()
                .map(AttributeValueMapper::toDto)
                .toList();

        // Implementation for fetching machine attributes can be added here
        return ResponseEntity.status(HttpStatus.OK).body(attributeValueDtos);
    }
}
