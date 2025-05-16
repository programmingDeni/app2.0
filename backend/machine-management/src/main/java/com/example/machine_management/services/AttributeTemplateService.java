package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.AttributeTemplateRepository; 
import com.example.machine_management.dto.AttributeTemplateDto;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeTemplateMapper;

@Service
public class AttributeTemplateService {

    @Autowired
    private AttributeTemplateRepository attributeTemplateRepository;

    @Autowired
    private MachineTemplateRepository templateRepos;

    public List<AttributeTemplateDto> getAllAttributeTemplates() {
        return attributeTemplateRepository.findAll()
            .stream()
            .map(AttributeTemplateMapper::toDto)
            .collect(Collectors.toList());
    }

    public AttributeTemplateDto getById(Integer id) {
        AttributeInTemplate template = attributeTemplateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden."));
        return AttributeTemplateMapper.toDto(template);
    }

    public List<AttributeTemplateDto> getByMachineTemplateId(Integer templateId) {
        return attributeTemplateRepository.findAllByMachineTemplateId(templateId)
            .stream()
            .map(AttributeTemplateMapper::toDto)
            .collect(Collectors.toList());
    }

    public AttributeTemplateDto createOneForTemplate(AttributeTemplateDto dto) {
        MachineTemplate template = templateRepos.findByIdWithAttributes(dto.machineTemplateId)
            .orElseThrow(() -> new NotFoundException("Template mit ID " + dto.machineTemplateId + " nicht gefunden."));
        
        AttributeInTemplate attr = new AttributeInTemplate(
            dto.attributeInTemplateName, 
            AttributeType.valueOf(dto.attributeInTemplateType), 
            template
        );
        
        AttributeInTemplate saved = attributeTemplateRepository.save(attr);
        return AttributeTemplateMapper.toDto(saved);
    }

    public AttributeTemplateDto updateAttributeTemplate(Integer id, AttributeTemplateDto dto) {
        AttributeInTemplate template = attributeTemplateRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden."));
        
        template.setAttributeInTemplateName(dto.attributeInTemplateName);
        template.setType(AttributeType.valueOf(dto.attributeInTemplateType));
        
        AttributeInTemplate updated = attributeTemplateRepository.save(template);
        return AttributeTemplateMapper.toDto(updated);
    }

    public void deleteAttributeTemplate(Integer id) {
        if (!attributeTemplateRepository.existsById(id)) {
            throw new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden.");
        }
        attributeTemplateRepository.deleteById(id);
    }

    public void deleteAllForTemplate(Integer templateId) {
        attributeTemplateRepository.deleteAllByMachineTemplateId(templateId);
    }

    public List<AttributeInTemplate> saveAllForTemplate(List<AttributeTemplateDto> attributeTemplates, MachineTemplate template) {
        List<AttributeInTemplate> savedAttributeTemplates = attributeTemplates.stream()
            .map(attr -> new AttributeInTemplate(
                attr.attributeInTemplateName, 
                AttributeType.valueOf(attr.attributeInTemplateType), 
                template
            ))
            .collect(Collectors.toList());

        return attributeTemplateRepository.saveAll(savedAttributeTemplates);
    }
}