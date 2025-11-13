package com.example.machine_management.controller.templates;
import com.example.machine_management.controller.base.AbstractNestedCrudController;
import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.TemplateAttributes.TemplateAttributeMapper;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.services.templates.TemplateAttributeOperationsService;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/machine-templates/{templateId}/attributes")
@Tag(name="Template attributes", description = "crud fuer template attribtues unter /api/machine-templates/attributes")
public class TemplateAttributeController extends AbstractNestedCrudController<TemplateAttribute, Integer, TemplateAttributeDto, CreateTemplateAttributeDTO, MachineTemplate, Integer> {

    private final TemplateAttributeOperationsService attributeTemplateService;
    private final TemplateAttributeMapper templateAttributeMapper;

    @Autowired
    public TemplateAttributeController(
            TemplateAttributeOperationsService attributeTemplateService,
            TemplateAttributeMapper templateAttributeMapper) {
        this.attributeTemplateService = attributeTemplateService;
        this.templateAttributeMapper = templateAttributeMapper;
    }

    @Override
    protected ParentManagementService<TemplateAttribute, Integer, TemplateAttributeDto, CreateTemplateAttributeDTO, MachineTemplate, Integer> getService() {
        return this.attributeTemplateService;
    }

    @Override
    protected EntityMapper<TemplateAttribute, TemplateAttributeDto> getMapper() {
        return this.templateAttributeMapper;
    }

    @Override
    protected MachineTemplate getParent(Integer parentId) {
        return attributeTemplateService.findParentById(parentId,false);
    }

    @Override
    protected boolean belongsToParent(TemplateAttribute entity, Integer parentId) {
        MachineTemplate template = getParent(parentId);
        if(template.getTemplateAttributes().contains(entity)){
            return true;
        }
        else{
            return false;
        }
    }

    @Override
    protected TemplateAttributeDto enrichDtoWithParentId(CreateTemplateAttributeDTO createDto, Integer parentId) {
        return new TemplateAttributeDto(createDto.attributeName,createDto.attributeType,parentId);
    }

    @Override
    protected List<TemplateAttribute> findByParentId(Integer parentId, boolean eager) {
        return attributeTemplateService.findEntitiesByParentId(parentId,eager);
    }  
}