package com.example.machine_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.dto.MachineTemplateDto;
import com.example.machine_management.mapper.MachineTemplateMapper;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.exceptions.NotFoundException;

@Service
public class MachineTemplateService {

    @Autowired
    private MachineTemplateRepository templateRepo;

    public List<MachineTemplateDto> getAllTemplates() {
        List<MachineTemplate> templates = templateRepo.findAll();
        return templates.stream()
            .map(MachineTemplateMapper::toDto)
            .collect(Collectors.toList());
    }

    public MachineTemplateDto getTemplateById(Integer id) {
        MachineTemplate template = templateRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Template mit ID " + id + " nicht gefunden."));
        return MachineTemplateMapper.toDto(template);
    }

    @Transactional
    public MachineTemplateDto createTemplate(MachineTemplateDto dto) {
        MachineTemplate template = new MachineTemplate();
        template.setTemplateName(dto.templateName); // Validation happens in entity
        return MachineTemplateMapper.toDto(templateRepo.save(template));
    }

    @Transactional
    public MachineTemplateDto updateTemplate(Integer id, MachineTemplateDto dto) {
        MachineTemplate template = templateRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Template mit ID " + id + " nicht gefunden."));
        
        template.setTemplateName(dto.templateName); // Validation happens in entity
        return MachineTemplateMapper.toDto(templateRepo.save(template));
    }

    @Transactional
    public void deleteTemplate(Integer id) {
        if (!templateRepo.existsById(id)) {
            throw new NotFoundException("Template mit ID " + id + " nicht gefunden.");
        }
        templateRepo.deleteById(id);
    }
}