package com.example.machine_management.dto.AttributeInTemplate;

import com.example.machine_management.models.AttributeType;

public class TemplateAttributeDto {
    public Integer id;
    public String attributeName;
    public AttributeType attributeType;

    public TemplateAttributeDto() {
    }

    public TemplateAttributeDto(Integer attributeId, String attributeName, AttributeType attributeType) {
        this.id = attributeId;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
    }
}
