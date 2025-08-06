package com.example.machine_management.dto.Machine;

import java.util.List;

import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;

public class MachineAttributesAndYearlyValuesDto {
    public Integer machineId;
    public List<MachineAttributeDto> attributes;
}