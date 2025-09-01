package com.example.machine_management.dto.AttributeInTemplate;

import com.example.machine_management.models.AttributeType;

public class CreateTemplateAttributeDTO {
    public String attributeName;
    public AttributeType attributeType;

    public CreateTemplateAttributeDTO() {
    }

    public CreateTemplateAttributeDTO(String attributeName, AttributeType attributeType) {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
    }
}
