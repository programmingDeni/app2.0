package com.example.machine_management.dto;

import java.util.List;

public class MachineDto {

    public int id;
    public String name;
    public List<MachineAttributeDto> attributes;

    public MachineDto() {}

    public MachineDto(int id, String name, List<MachineAttributeDto> attributes) {
        this.id = id;
        this.name = name;
        this.attributes = attributes;
    }
}
