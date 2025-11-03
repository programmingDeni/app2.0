package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.machine_management.models.TemplateAttribute;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.AttributeTemplateRepository;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.util.SecurityUtils;
import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeTemplateMapper;
import com.example.machine_management.mapper.TemplateAttributes.TemplateAttributeMapper;

@Service
public class AttributeTemplateService extends GenericCrudService<TemplateAttribute, Integer, AttributeTemplateDto> {

    private final AttributeTemplateRepository attributeTemplateRepository;

    private final MachineTemplateRepository templateRepos;

    private final AttributeTemplateMapper attributeTemplateMapper;

    @Autowired
    public AttributeTemplateService(AttributeTemplateRepository attributeTemplateRepository,
            MachineTemplateRepository templateRepos, AttributeTemplateMapper attributeTemplateMapper) {
        super(attributeTemplateRepository, attributeTemplateMapper);
        this.attributeTemplateMapper = attributeTemplateMapper;
        this.attributeTemplateRepository = attributeTemplateRepository;
        this.templateRepos = templateRepos;
    }

    public List<TemplateAttribute> getByMachineTemplateId(Integer templateId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        List<TemplateAttribute> attributes = attributeTemplateRepository.findAllByMachineTemplateIdAndUserId(templateId,
                userId);
        return attributes;
    }

    public TemplateAttribute createOneForTemplate(AttributeTemplateDto dto) {
        Integer userId = SecurityUtils.getCurrentUserId();

        MachineTemplate template = templateRepos.findByIdWithAttributesAndUserId(dto.machineTemplateId, userId)
                .orElseThrow(
                        () -> new NotFoundException("Template mit ID " + dto.machineTemplateId + " nicht gefunden."));

        TemplateAttribute fromDto = attributeTemplateMapper.fromDto(dto, template);
        fromDto.setUserId(userId);
        if (fromDto.getUserId() == null) {
            throw new IllegalArgumentException("AttributeTemplateService: UserId darf nicht null sein");
        }

        TemplateAttribute saved = attributeTemplateRepository.save(fromDto);
        return (saved);
    }

    public TemplateAttribute updateAttributeTemplate(Integer id, AttributeTemplateDto dto) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }
        // AttributInTemplate finden oder fehler werfen
        TemplateAttribute template = attributeTemplateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden."));

        // template updaten
        attributeTemplateMapper.updateFromDto(template, dto);

        // speichern
        if (template.getMachineTemplate() == null) {
            throw new IllegalArgumentException("Template darf nicht null sein");
        }
        TemplateAttribute updated = attributeTemplateRepository.save(template);

        // dto returnen
        return (updated);
    }

    public void deleteAllForTemplate(Integer templateId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        List<TemplateAttribute> attributes = attributeTemplateRepository.findAllByMachineTemplateIdAndUserId(templateId,
                userId);
        if (attributes.isEmpty()) {
            throw new NotFoundException("Template mit ID " + templateId + " nicht gefunden.");
        }
        attributeTemplateRepository.deleteAll(attributes);
    }

    public List<TemplateAttribute> saveAllForTemplate(List<AttributeTemplateDto> attributeTemplates,
            MachineTemplate template) {
        Integer userId = SecurityUtils.getCurrentUserId();

        List<TemplateAttribute> savedAttributeTemplates = attributeTemplateMapper.fromDtoList(attributeTemplates,
                template);
        if (savedAttributeTemplates.isEmpty()) {
            throw new IllegalArgumentException("Template darf nicht null sein");
        }

        // Set userId for all attributes
        for (TemplateAttribute attr : savedAttributeTemplates) {
            attr.setUserId(userId);
        }

        return attributeTemplateRepository.saveAll(savedAttributeTemplates);
    }

    // ============= Implementierung der abstrakten Methoden aus GenericCrudService
    // =============

    @Override
    protected TemplateAttribute updateEntity(TemplateAttribute existingEntity, AttributeTemplateDto dto) {
        existingEntity.setAttributeInTemplateName(dto.templateAttributeName);
        existingEntity.setType(AttributeType.valueOf(dto.templateAttributeType));
        return existingEntity;
    }

    @Override
    protected List<TemplateAttribute> findAllByUserId(Integer userId) {
        return attributeTemplateRepository.findByUserId(userId);
    }

    @Override
    protected Optional<TemplateAttribute> findByIdAndUserId(Integer id, Integer userId) {
        return attributeTemplateRepository.findByIdAndUserId(id, userId);

    }

    @Override
    protected void setUserId(TemplateAttribute entity, Integer userId) {
        entity.setUserId(userId);
    }
}