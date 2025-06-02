package com.example.machine_management.dto;

public class LazyMachineDto {
    public Integer id;
    public String name;
    public String templateName;

    public LazyMachineDto() {}

    public LazyMachineDto(Integer id, String name, String templateName) {
        this.id = id;
        this.name = name;
        this.templateName = templateName;
    }
    
}
