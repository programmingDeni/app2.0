package com.example.machine_management.dto;

import com.example.machine_management.models.MachineAttribute;

public class AttributeValueDto {
    public int year;
    public MachineAttribute machineAttribute;
    public String value;

    public AttributeValueDto() {}

    public AttributeValueDto(int year, MachineAttribute machineAttribute, String value) {
        this.year = year;
        this.machineAttribute = machineAttribute;
        this.value = value;
    }
}
