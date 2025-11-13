package com.example.machine_management.controller.machines;

import com.example.machine_management.controller.base.AbstractCrudController;
import com.example.machine_management.services.abstracts.CrudService;
import com.example.machine_management.services.machine.MachineService;

import lombok.extern.slf4j.Slf4j;

import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.machine.Machine;

import org.springframework.web.bind.annotation.*;

// OpenAPI/Swagger Annotations
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller für grundlegende CRUD-Operationen auf Maschinen.
 * Template- und Attribut-bezogene Operationen sind in separaten Controllern.
 */
@Slf4j
@RestController
@Tag(name = "Machines", description = "Machine CRUD operations")
@RequestMapping("/api/machines")
public class MachineController extends AbstractCrudController<Machine, Integer, MachineDto> {
    
    private final MachineService machineService;
    private final MachineMapper machineMapper;

    public MachineController(MachineService machineService,
     MachineMapper machineMapper,
     MachineAttributeMapper machineAttributeMapper){
        this.machineService = machineService;
        this.machineMapper = machineMapper;
    }

    @Override
    protected CrudService<Machine, Integer, MachineDto> getService() {
        return this.machineService;    
    }

    @Override
    protected EntityMapper<Machine, MachineDto> getMapper() {
        return this.machineMapper;
    }
    
}