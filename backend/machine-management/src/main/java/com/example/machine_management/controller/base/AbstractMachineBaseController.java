package com.example.machine_management.controller.base;

import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.services.machine.MachineService;

import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractMachineBaseController {
    
    @Autowired
    protected MachineService machineService;

    @Autowired
    protected MachineMapper machineMapper;

    protected boolean isValidMachineDto(MachineDto dto) {
        return dto.machineName != null && !dto.machineName.trim().isEmpty();
    }

    protected boolean isValidTemplateDto(CreateMachineFromTemplateDto dto) {
        return dto != null &&
                dto.machineName != null &&
                !dto.machineName.trim().isEmpty() &&
                dto.machineTemplateId != null &&
                dto.machineTemplateId > 0;
    }

    protected boolean isValidAttributeDto(MachineAttributeDto dto) {
        return dto.attributeName != null &&
                !dto.attributeName.trim().isEmpty() &&
                dto.attributeType != null &&
                dto.machineId > 0;
    }

    protected boolean isValidMachineAttributeDto(CreateMachineAttributeDto dto) {
        return dto.attributeName != null &&
                !dto.attributeName.trim().isEmpty() &&
                dto.attributeType != null;
    }
}