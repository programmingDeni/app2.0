// MachineTemplateController.java
package com.example.machine_management.controller.templates;

import com.example.machine_management.dto.*;
import com.example.machine_management.dto.AttributeInTemplate.CreateTemplateAttributeDTO;
import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.services.MachineTemplateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.List;
import java.util.stream.Collectors;

import com.example.machine_management.models.TemplateAttribute;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.mapper.AttributeTemplateMapper;
import com.example.machine_management.mapper.MachineStructureMapper;
import com.example.machine_management.mapper.MachineTemplateMapper;
import com.example.machine_management.mapper.TemplateAttributes.TemplateAttributeMapper;

@RestController
@RequestMapping("/api/machine-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineTemplateController {

    private final MachineTemplateService templateService;
    private final MachineTemplateMapper machineTemplateMapper;
    private final TemplateAttributeMapper templateAttributeMapper;

    @Autowired
    public MachineTemplateController(
            MachineTemplateService templateService,
            MachineTemplateMapper machineTemplateMapper, TemplateAttributeMapper templateAttributeMapper) {
        this.templateService = templateService;
        this.machineTemplateMapper = machineTemplateMapper;
        this.templateAttributeMapper = templateAttributeMapper;
    }

    @PostMapping
    public ResponseEntity<MachineTemplateDto> createTemplate(@RequestBody MachineTemplateDto dto) {
        // 1. Validate
        if (dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid template data");
        }

        // 2. Create entity
        MachineTemplate created = templateService.createTemplate(dto);

        // 3. Map and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(machineTemplateMapper.toDto(created));
    }

    // lazy loading
    @GetMapping("lazy")
    public ResponseEntity<List<MachineTemplateDto>> getAllTemplates() {
        // 1. Get entities
        List<MachineTemplate> templates = templateService.getAllTemplatesLazy();

        // 2. Map and return
        return ResponseEntity.ok(templates.stream()
                .map(machineTemplateMapper::toDtoLazy)
                .collect(Collectors.toList()));
    }

    @GetMapping("full")
    public ResponseEntity<List<MachineTemplateDto>> getAllTemplatesWithAttributes() {
        // 1. Get entities
        List<MachineTemplate> templates = templateService.getAllTemplatesWithAttributes();

        // 2. Map and return
        return ResponseEntity.ok(templates.stream()
                .map(machineTemplateMapper::toDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> getTemplateById(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity
        MachineTemplate template = templateService.getTemplateById(id);

        // 3. Map and return
        return ResponseEntity.ok(machineTemplateMapper.toDto(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> updateTemplate(
            @PathVariable Integer id,
            @RequestBody MachineTemplateDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update entity
        MachineTemplate updated = templateService.updateTemplate(id, dto);

        // 3. Map and return
        return ResponseEntity.ok(machineTemplateMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete
        templateService.deleteTemplate(id);

        // 3. Return success
        return ResponseEntity.noContent().build();
    }

    /*
     * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% TEMPLATE ATTRIBUTES
     * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
     */

    // Create an attribute within an existing template
    // `/api/machine-templates/${templateId}/attributes`,
    @PostMapping("/{templateId}/attributes")
    public ResponseEntity<List<TemplateAttributeDto>> addAttributesToExistingTemplate(@PathVariable Integer templateId,
            @RequestBody List<CreateTemplateAttributeDTO> attributes) {
        // Validierung
        if (templateId == null || templateId <= 0 || attributes == null || attributes.isEmpty()) {
            throw new IllegalArgumentException("Invalid input");
        }

        // Service call um das / die attribute zu erstellen
        List<TemplateAttribute> created = templateService.addAttributesToTemplate(templateId, attributes);

        // Erstellte Attribute in Dtos umwandeln
        List<TemplateAttributeDto> dtos = created.stream()
                .map(templateAttributeMapper::toDto)
                .collect(Collectors.toList());
        // Zurückgeben
        return ResponseEntity.status(HttpStatus.CREATED).body(dtos);
    }

    @PutMapping("/{templateId}/attributes/{attributeId}")
    public ResponseEntity<TemplateAttributeDto> updateTemplateAttribute(@PathVariable Integer templateId,
            @PathVariable Integer attributeId,
            @RequestBody TemplateAttributeDto dto) {
        // Validierung
        if (templateId == null || templateId <= 0 || attributeId == null || attributeId <= 0 || dto == null) {
            throw new IllegalArgumentException("Invalid input");
        }

        // Service call um das / die attribute zu verändern
        TemplateAttribute updated = templateService.updateTemplateAttribute(templateId, attributeId, dto);

        // Erstellte Attribute in Dtos umwandeln
        return ResponseEntity.status(HttpStatus.OK).body(templateAttributeMapper.toDto(updated));
    }

    @DeleteMapping("/{templateId}/attributes/{attributeId}")
    public ResponseEntity<Void> deleteAttributeFromTemplate(@PathVariable Integer templateId,
            @PathVariable Integer attributeId) {
        if (templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Backend MachineTemplate Controller: Invalid Template Id");
        } else if (attributeId == null || attributeId <= 0) {
            throw new IllegalArgumentException("Backend MachineTemplate Controller: Invalid Attribute Id");
        }
        // call service to perform removal
        templateService.removeAttributeFromTemplate(templateId, attributeId);

        // return status
        return ResponseEntity.noContent().build();
    }

    private boolean isValidTemplateDto(MachineTemplateDto dto) {
        return dto.templateName != null && !dto.templateName.trim().isEmpty();
    }
}