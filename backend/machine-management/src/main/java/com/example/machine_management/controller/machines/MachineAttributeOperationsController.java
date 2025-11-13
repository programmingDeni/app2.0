package com.example.machine_management.controller.machines;
import com.example.machine_management.controller.base.AbstractNestedCrudController;
import com.example.machine_management.dto.MachineAttributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.services.machine.MachineAttributeOperationsService;
import com.example.machine_management.services.machine.MachineService;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Machine Attributes", description = "Manage attributes within a machine (nested under /machines/{machineId}/attributes)")
@RestController
@RequestMapping("/api/machines/{machineId}/attributes")
public class MachineAttributeOperationsController 
    extends AbstractNestedCrudController<MachineAttribute, Integer, 
        MachineAttributeDto, CreateMachineAttributeDto, Machine, Integer> {

    private final MachineAttributeOperationsService machineAttributeService;

    private final MachineAttributeMapper machineAttributeMapper;

    private final MachineService machineService;

    @Autowired
    public MachineAttributeOperationsController(MachineAttributeOperationsService machineAttributeService,
            MachineAttributeMapper machineAttributeMapper,
            MachineService machineService) {
        this.machineAttributeService = machineAttributeService;
        this.machineAttributeMapper = machineAttributeMapper;
        this.machineService = machineService;
    }

    @Override
    protected ParentManagementService<MachineAttribute, Integer, MachineAttributeDto, CreateMachineAttributeDto, Machine, Integer> getService() {
        return this.machineAttributeService;
    }

    @Override
    protected EntityMapper<MachineAttribute, MachineAttributeDto> getMapper() {
        return this.machineAttributeMapper;
    }

    @Override
    protected Machine getParent(Integer parentId) {
        return machineService.userFindById(parentId, false);
    }

    @Override
    protected boolean belongsToParent(MachineAttribute entity, Integer parentId) {
        Machine machine = getParent(parentId);
        if(machine.getMachineAttributes().contains(entity)){
            return true;
        }
        else {
            return false;
        }
    }

    @Override
    protected MachineAttributeDto enrichDtoWithParentId(CreateMachineAttributeDto createDto, Integer parentId) {
        return new MachineAttributeDto(createDto.attributeName, createDto.attributeType, parentId);
    }

    @Override
    protected List<MachineAttribute> findByParentId(Integer parentId, boolean eager) {
        return machineAttributeService.findEntitiesByParentId(parentId, eager);
    }



    
}