package com.example.machine_management.dto.AttributeInTemplate;

import com.example.machine_management.models.enums.AttributeType;

public class CreateTemplateAttributeDTO {
    public String attributeName;
    public AttributeType attributeType;
    public Integer templateId;

    public CreateTemplateAttributeDTO() {
    }

    public CreateTemplateAttributeDTO(String attributeName, AttributeType attributeType, Integer templateId) {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.templateId = templateId;
    }
}
