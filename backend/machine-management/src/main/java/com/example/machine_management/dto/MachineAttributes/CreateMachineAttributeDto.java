package com.example.machine_management.dto.MachineAttributes;

import com.example.machine_management.models.enums.AttributeType;

import jakarta.validation.constraints.*;

public class CreateMachineAttributeDto {
    @NotNull(message = "attributname darf nicht null sein")
    @NotBlank(message = "AttributeName darf nicht leer sein")
    public String attributeName;
    @NotNull(message = "AttributType darf nicht null sein")
    public AttributeType attributeType;

    public CreateMachineAttributeDto(String attributeName, AttributeType attributeType){
        this.attributeName = attributeName;
        this.attributeType = attributeType;
    }
}
