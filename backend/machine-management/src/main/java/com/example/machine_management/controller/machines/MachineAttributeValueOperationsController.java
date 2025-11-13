package com.example.machine_management.controller.machines;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.dto.AttributeValue.CreateAttributeValueDto;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.machine.AttributeValue;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.services.AttributeValueService;
import com.example.machine_management.services.abstracts.CrudService;
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.services.machine.MachineAttributeOperationsService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.*;

import com.example.machine_management.controller.base.AbstractCrudController;
import com.example.machine_management.controller.base.AbstractNestedCrudController;

@Tag(name = "Attribute Values", description = "Values for machine attributes, route: '/api/machines/attributes/values'")
@RestController
@RequestMapping("/api/machines/{machineId}/attributes/{attributeId}/values")
public class MachineAttributeValueOperationsController extends AbstractNestedCrudController<AttributeValue,Integer,AttributeValueDto, CreateAttributeValueDto, MachineAttribute, Integer> {

    private final AttributeValueService attributeValueService;
    private final AttributeValueMapper attributeValueMapper;
    private final MachineAttributeOperationsService machineAttributeOperationsService;
    @Autowired
    public MachineAttributeValueOperationsController(AttributeValueService attributeValueService,
            AttributeValueMapper attributeValueMapper,
            MachineAttributeOperationsService machineAttributeOperationsService) {
        this.attributeValueService = attributeValueService;
        this.attributeValueMapper = attributeValueMapper;
        this.machineAttributeOperationsService=machineAttributeOperationsService;
    }

    @Override
    protected ParentManagementService<AttributeValue, Integer, AttributeValueDto, CreateAttributeValueDto, MachineAttribute, Integer> getService() {
        return this.attributeValueService;
    }

    @Override
    protected EntityMapper<AttributeValue, AttributeValueDto> getMapper() {
        return this.attributeValueMapper;
    }

    @Override
    protected MachineAttribute getParent(Integer parentId) {
        return attributeValueService.findParentById(parentId, false);
    }

    @Override
    protected boolean belongsToParent(AttributeValue entity, Integer parentId) {
        MachineAttribute machineAttribute = getParent(parentId);
        if(machineAttribute.getAttributeValues().contains(entity)){
            return true;
        }
        else {
            return false;
        }
    }

    @Override
    protected AttributeValueDto enrichDtoWithParentId(CreateAttributeValueDto createDto, Integer parentId) {
        return new AttributeValueDto(createDto.attributeValueYear,parentId,createDto.attributeValue);
    }

    @Override
    protected List<AttributeValue> findByParentId(Integer parentId, boolean eager) {
        return attributeValueService.findEntitiesByParentId(parentId, eager);
    }


}
