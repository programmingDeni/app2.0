// MachineTemplateController.java
package com.example.machine_management.controller.templates;

import com.example.machine_management.controller.base.AbstractCrudController;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.services.abstracts.CrudService;
import com.example.machine_management.services.templates.MachineTemplateService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.MachineTemplateMapper;
import com.example.machine_management.models.template.MachineTemplate;

@RestController
@RequestMapping("/api/machine-templates")
@Tag(name = "Machine Tempaltes", description = "Crud fuer machine tempaltes unter '/api/machine-templates' ")
public class TemplateController extends AbstractCrudController<MachineTemplate, Integer, MachineTemplateDto> {

    private final MachineTemplateService machineTemplateService;
    private final MachineTemplateMapper machineTemplateMapper;

    @Autowired
    public TemplateController(
            MachineTemplateService templateService,
            MachineTemplateMapper machineTemplateMapper) {
        this.machineTemplateService = templateService;
        this.machineTemplateMapper = machineTemplateMapper;
    }

    @Override
    protected CrudService<MachineTemplate, Integer, MachineTemplateDto> getService() {
        return this.machineTemplateService;
    }

    @Override
    protected EntityMapper<MachineTemplate, MachineTemplateDto> getMapper() {
        return this.machineTemplateMapper;
    }
}