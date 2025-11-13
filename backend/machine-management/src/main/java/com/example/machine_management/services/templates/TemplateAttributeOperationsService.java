package com.example.machine_management.services.templates;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;
import com.example.machine_management.repository.TemplateAttributeRepository;
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.util.SecurityUtils;

import jakarta.xml.bind.ValidationException;

@Service
public class TemplateAttributeOperationsService extends ParentManagementService<TemplateAttribute, Integer, TemplateAttributeDto, CreateTemplateAttributeDTO, MachineTemplate, Integer>{

    private final TemplateAttributeRepository templateAttributeRepository;
    private final MachineTemplateService machineTemplateService;


    @Autowired
    public TemplateAttributeOperationsService(TemplateAttributeRepository templateAttributeRepository,
    MachineTemplateService machineTemplateService){
        super(templateAttributeRepository);
        this.templateAttributeRepository = templateAttributeRepository;
        this.machineTemplateService = machineTemplateService;
    }

    //add single attribute to template
    protected TemplateAttribute addAttributeToTemplate(MachineTemplate template, CreateTemplateAttributeDTO dto) {
        Integer userId = SecurityUtils.getCurrentUserId();

        if (dto.attributeName == null || dto.attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("Attributname darf nicht leer sein");
        }
        
        TemplateAttribute attribute = new TemplateAttribute(
            dto.attributeName,
            dto.attributeType,
            template
        );
        attribute.setUserId(userId);

        template.addAttribute(attribute);

        return attribute;
    }

    @Override
    protected TemplateAttribute createEntity(CreateTemplateAttributeDTO dto, MachineTemplate parent) {
        //validateTemplateAttributeDto(dto);
        TemplateAttribute created = new TemplateAttribute(
            dto.attributeName,
            dto.attributeType,
            parent
        );
        return created;
    }

    @Override
    protected TemplateAttribute updateEntity(TemplateAttribute existingEntity, TemplateAttributeDto updateDto) {
        validateTemplateAttributeDto(updateDto);
        if(updateDto.templateId == null){
            throw new IllegalArgumentException("Updated Dto has to have a templateId");
        }
        existingEntity.setAttributeInTemplateName(updateDto.attributeName);
        existingEntity.setType(updateDto.attributeType);
        return existingEntity;
    }

    @Override
    protected void addEntityToParent(MachineTemplate parent, TemplateAttribute entity) {
        parent.addAttribute(entity);
    }

    @Override
    protected void removeEntityFromParent(Integer parentId, TemplateAttribute entity) {
        MachineTemplate parent = this.findParentById(parentId, false);
        parent.removeAttribute(entity);
    }

    @Override
    protected Optional<TemplateAttribute> userFindByIdLazy(Integer id, Integer userId) {
        return templateAttributeRepository.findByIdAndUserId(id, userId);
    }

    @Override
    protected Optional<TemplateAttribute> userFindByIdEager(Integer id, Integer userId) {
        throw new UnsupportedOperationException("TemplateAttributes have no children'");
    }

    @Override
    protected Optional<TemplateAttribute> adminFindByIdEager(Integer id) {
        return templateAttributeRepository.findById(id);
    }

    @Override
    protected List<TemplateAttribute> adminFindAllEager() {
        return templateAttributeRepository.findAll();
    }

    private void validateTemplateAttributeDto(TemplateAttributeDto templateAttributeDto){
        if(templateAttributeDto.attributeName == null || templateAttributeDto.attributeName.trim() == ""){
            throw new IllegalArgumentException("Error in attributeName");
        }
        if(templateAttributeDto.attributeType == null){
            throw new IllegalArgumentException("Attribut Typ error");
        }

    }

    @Override
    protected MachineTemplate eagerFindParentById(Integer parentId) {
        return machineTemplateService.userFindById(parentId,true);
    }

    @Override
    protected MachineTemplate lazyFindParentById(Integer parentId) {
        return machineTemplateService.userFindById(parentId,false);
    }

    @Override
    protected List<TemplateAttribute> eagerFindEntitiesByParentId(Integer parentId) {
        throw new UnsupportedOperationException("Unimplemented method 'eagerFindEntitiesByParentId'");
    }

    @Override
    protected List<TemplateAttribute> lazyFindEntitiesByParentId(Integer parentId) {
        return templateAttributeRepository.findAllByMachineTemplateId(parentId);
    }

}
