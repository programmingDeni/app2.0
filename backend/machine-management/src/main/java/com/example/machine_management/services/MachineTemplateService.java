package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.mapper.MachineTemplateMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;
import com.example.machine_management.exceptions.NotFoundException;

@Service
public class MachineTemplateService {

    @Autowired
    private MachineTemplateRepository templateRepo;

    @Autowired
    private AttributeTemplateService attributeTemplateService;

    public List<MachineTemplate> getAllTemplatesLazy() {
        return templateRepo.findAll();
    }

    public List<MachineTemplate> getAllTemplatesWithAttributes() {
        return templateRepo.findAllWithAttributeTemplates();
    }

    public MachineTemplate getTemplateById(Integer id) {
        return templateRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Template mit ID " + id + " nicht gefunden."));
    }

    @Transactional
    public MachineTemplate createTemplate(MachineTemplateDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName); // Validation happens in entity
        return templateRepo.save(template);
    }

    @Transactional
    public MachineTemplate createTemplateWithAttributes(CreateMachineTemplateWithAttributesDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName); // Validation happens in entity
        // speichern, sonst keine id
        MachineTemplate saved = templateRepo.save(template);

        if (dto.attributeTemplates == null || dto.attributeTemplates.isEmpty() || saved.getId() == null) { // wenn keine
                                                                                                           // attriutes
                                                                                                           // vorhanden
            throw new IllegalArgumentException("Template darf nicht leer sein.");
        } else {
            // hier muss dass attribute tempalte erstellt werden ohne existiierende
            // attribute_template_id
            for (AttributeTemplateDto attr : dto.attributeTemplates) {
                // templatze id setzen
                attr.machineTemplateId = saved.getId();
                // attribute template erstellen
                attributeTemplateService.createOneForTemplate(attr);
            }
        }
        return templateRepo.save(saved);
    }

    @Transactional
    public MachineTemplate updateTemplate(Integer id, MachineTemplateDto dto) {
        MachineTemplate template = templateRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Template mit ID " + id + " nicht gefunden."));

        template.setTemplateName(dto.templateName); // Validation happens in entity
        return templateRepo.save(template);
    }

    @Transactional
    public void deleteTemplate(Integer id) {
        if (!templateRepo.existsById(id)) {
            throw new NotFoundException("Template mit ID " + id + " nicht gefunden.");
        }
        templateRepo.deleteById(id);
    }

    @Transactional
    public void removeAttributeFromTemplate(Integer templateId, Integer attributeId) {
        MachineTemplate template = templateRepo.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));

        AttributeInTemplate attribute = template.getAttributeTemplates().stream()
                .filter(a -> a.getId() == attributeId)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Attribut in dem Template nicht gefunden "));

        template.getAttributeTemplates().remove(attribute);
        // orphan removal sollte das attribut entfernen
        templateRepo.save(template);

    }

    @Transactional
    public List<AttributeInTemplate> addAttributesToTemplate(Integer templateId,
            List<CreateTemplateAttributeDTO> attributes) {
        MachineTemplate template = templateRepo.findById(templateId)
                .orElseThrow(() -> new NotFoundException("Template mit ID " + templateId + " nicht gefunden."));

        // Attribute in Template erstellen
        List<AttributeInTemplate> created = attributes.stream()
                .map(a -> new AttributeInTemplate(a.attributeName,
                        a.attributeType, template))
                .collect(Collectors.toList());

        // die irgendwie speichern
        template.getAttributeTemplates().addAll(created);
        templateRepo.save(template);

        return created;
    }
}