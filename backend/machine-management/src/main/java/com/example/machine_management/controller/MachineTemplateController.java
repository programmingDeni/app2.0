// MachineTemplateController.java
package com.example.machine_management.controller;

import com.example.machine_management.dto.*;
import com.example.machine_management.services.MachineTemplateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.List;

@RestController
@RequestMapping("/api/machine-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineTemplateController {

    @Autowired
    private MachineTemplateService machineTemplateService;

    @GetMapping
    public ResponseEntity<List<MachineTemplateDto>> getAllTemplates() {
        return ResponseEntity.ok(machineTemplateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> getTemplateById(@PathVariable Integer id) {
        return ResponseEntity.ok(machineTemplateService.getTemplateById(id));
    }

    @PostMapping
    public ResponseEntity<MachineTemplateDto> createTemplate(@RequestBody MachineTemplateDto dto) {
        return ResponseEntity.ok(machineTemplateService.createTemplate(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineTemplateDto> updateTemplate(
            @PathVariable Integer id, 
            @RequestBody MachineTemplateDto updatedTemplate) {
        return ResponseEntity.ok(machineTemplateService.updateTemplate(id, updatedTemplate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTemplate(@PathVariable Integer id) {
        machineTemplateService.deleteTemplate(id);
        return ResponseEntity.ok("Template mit ID " + id + " wurde gelöscht.");
    }
}
