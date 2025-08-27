package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.AttributeTemplateRepository;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;
import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.AttributeTemplateMapper;

@Service
public class AttributeTemplateService {

    @Autowired
    private AttributeTemplateRepository attributeTemplateRepository;

    @Autowired
    private MachineTemplateRepository templateRepos;

    public List<AttributeInTemplate> getAllAttributeTemplates() {
        // hole attributes aus repo
        List<AttributeInTemplate> attributes = attributeTemplateRepository.findAll();
        // konvertiere zu dtos und return
        return attributes;
    }

    public AttributeInTemplate getById(Integer id) {
        AttributeInTemplate template = attributeTemplateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden."));
        return template;
    }

    public List<AttributeInTemplate> getByMachineTemplateId(Integer templateId) {
        List<AttributeInTemplate> attributes = attributeTemplateRepository.findAllByMachineTemplateId(templateId);
        return attributes;
    }

    public AttributeInTemplate createOneForTemplate(AttributeTemplateDto dto) {
        MachineTemplate template = templateRepos.findByIdWithAttributes(dto.machineTemplateId)
                .orElseThrow(
                        () -> new NotFoundException("Template mit ID " + dto.machineTemplateId + " nicht gefunden."));

        AttributeInTemplate fromDto = AttributeTemplateMapper.fromDto(dto, template);

        AttributeInTemplate saved = attributeTemplateRepository.save(fromDto);
        return (saved);
    }

    public AttributeInTemplate updateAttributeTemplate(Integer id, AttributeTemplateDto dto) {
        // AttributInTemplate finden oder fehler werfen
        AttributeInTemplate template = attributeTemplateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attribute-Template mit ID " + id + " nicht gefunden."));

        // template updaten
        AttributeTemplateMapper.updateFromDto(template, dto);

        // speichern
        AttributeInTemplate updated = attributeTemplateRepository.save(template);

        // dto returnen
        return (updated);
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

    public List<AttributeInTemplate> saveAllForTemplate(List<AttributeTemplateDto> attributeTemplates,
            MachineTemplate template) {
        List<AttributeInTemplate> savedAttributeTemplates = AttributeTemplateMapper.fromDtoList(attributeTemplates,
                template);

        return attributeTemplateRepository.saveAll(savedAttributeTemplates);
    }
}