package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.machine_management.dto.AttributeInTemplate.AttributeTemplateDto;
import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.TemplateAttribute;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.services.machine.MachineService;
import com.example.machine_management.util.SecurityUtils;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.exceptions.TemplateInUseException;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.MachineTemplateMapper;

@Service
public class MachineTemplateService extends GenericCrudService<MachineTemplate, Integer, MachineTemplateDto> {

        private final MachineTemplateRepository templateRepo;
        private final MachineService machineService;
        private final AttributeTemplateService attributeTemplateService;

        @Autowired
        public MachineTemplateService(
                        MachineTemplateRepository templateRepo,
                        MachineTemplateMapper mapper,
                        MachineService machineService,
                        AttributeTemplateService attributeTemplateService) {
                super(templateRepo, mapper);
                this.templateRepo = templateRepo;
                this.machineService = machineService;
                this.attributeTemplateService = attributeTemplateService;
        }

        public List<MachineTemplate> getAllTemplatesLazy() {
                Integer userId = SecurityUtils.getCurrentUserId();
                return templateRepo.findAllByUserId(userId);
        }

        public List<MachineTemplate> getAllTemplatesWithAttributes() {
                Integer userId = SecurityUtils.getCurrentUserId();
                return templateRepo.findAllWithAttributeTemplatesByUserId(userId);
        }

        public MachineTemplate getTemplateById(Integer id) {
                Integer userId = SecurityUtils.getCurrentUserId();
                return templateRepo.findByIdAndUserId(id, userId)
                                .orElseThrow(() -> new NotFoundException("Template mit ID " + id + " nicht gefunden."));
        }

        @Transactional
        public MachineTemplate createTemplate(MachineTemplateDto dto) {
                Integer userId = SecurityUtils.getCurrentUserId();

                MachineTemplate template = new MachineTemplate();
                template.setUserId(userId);
                template.setTemplateName(dto.templateName); // Validation happens in entity
                MachineTemplate saved = templateRepo.save(template);

                // Falls Attribute mitgegeben werden, diese anlegen
                if (dto.templateAttributes != null && !dto.templateAttributes.isEmpty()) {
                        for (AttributeTemplateDto attr : dto.templateAttributes) {
                                attr.machineTemplateId = saved.getId();
                                // TODO: muss ich nicht hier auch die id setzen? ah wsl in der service
                                // methode
                                attributeTemplateService.createOneForTemplate(attr);
                        }
                        // Optional: Template nochmal speichern, falls die Beziehung bidirektional ist
                        templateRepo.save(saved);
                }

                return saved;
        }

        @Transactional
        public MachineTemplate updateTemplate(Integer id, MachineTemplateDto dto) {
                MachineTemplate template = getTemplateById(id);

                template.setTemplateName(dto.templateName); // Validation happens in entity
                return templateRepo.save(template);
        }

        @Transactional
        public void deleteTemplate(Integer id) {
                MachineTemplate template = getTemplateById(id);
                List<Machine> machines = machineService.findByTemplate(template);

                if (!machines.isEmpty()) {
                        List<String> machineNames = machines.stream()
                                        .map(Machine::getMachineName)
                                        .collect(Collectors.toList());
                        throw new TemplateInUseException(
                                        "Template wird noch von folgenden Maschinen verwendet: " + machineNames);
                }
                templateRepo.deleteById(id);
        }

        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Attribute
        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

        @Transactional
        public List<TemplateAttribute> addAttributesToTemplate(Integer templateId,
                        List<CreateTemplateAttributeDTO> attributes) {
                MachineTemplate template = getTemplateById(templateId);

                // Attribute in Template erstellen
                List<TemplateAttribute> created = attributes.stream()
                                .map(a -> new TemplateAttribute(a.attributeName,
                                                a.attributeType, template))
                                .collect(Collectors.toList());

                // die irgendwie speichern
                // template.getAttributeTemplates().addAll(created);
                templateRepo.save(template);

                // Nach dem Speichern: Die neuen Attribute mit IDs aus dem Template holen
                List<TemplateAttribute> savedAttributes = template.getAttributeTemplates().stream()
                                .filter(attr -> attributes.stream()
                                                .anyMatch(a -> a.attributeName.equals(attr.getAttributeInTemplateName())
                                                                &&
                                                                a.attributeType == attr.getType()))
                                .collect(Collectors.toList());

                return savedAttributes;
        }

        @Transactional
        public TemplateAttribute updateTemplateAttribute(Integer templateId, Integer attributeId,
                        TemplateAttributeDto dto) {
                MachineTemplate template = getTemplateById(templateId);

                TemplateAttribute attribute = template.getAttributeTemplates().stream()
                                .filter(a -> a.getId() == attributeId)
                                .findFirst()
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Attribut in dem Template nicht gefunden "));

                attribute.setAttributeInTemplateName(dto.attributeName);
                attribute.setType(dto.attributeType);
                templateRepo.save(template);

                return attribute;
        }

        @Transactional
        public void removeAttributeFromTemplate(Integer templateId, Integer attributeId) {
                MachineTemplate template = getTemplateById(templateId);

                TemplateAttribute attribute = template.getAttributeTemplates().stream()
                                .filter(a -> a.getId() == attributeId)
                                .findFirst()
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Attribut in dem Template nicht gefunden "));

                template.getAttributeTemplates().remove(attribute);
                // orphan removal sollte das attribut entfernen
                templateRepo.save(template);

        }

        @Override
        protected MachineTemplate updateEntity(MachineTemplate existingEntity, MachineTemplateDto dto) {
                return updateTemplate(existingEntity.getId(), dto);
        }

        @Override
        protected List<MachineTemplate> findAllByUserId(Integer userId) {
                return templateRepo.findAllByUserId(userId);
        }

        @Override
        protected Optional<MachineTemplate> findByIdAndUserId(Integer id, Integer userId) {
                return templateRepo.findByIdAndUserId(id, userId);
        }

        @Override
        protected void setUserId(MachineTemplate entity, Integer userId) {
                entity.setUserId(userId);
        }
}