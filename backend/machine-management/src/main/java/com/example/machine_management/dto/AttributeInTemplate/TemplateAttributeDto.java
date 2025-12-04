package com.example.machine_management.dto.AttributeInTemplate;

import com.example.machine_management.models.enums.AttributeType;

public class TemplateAttributeDto {
    public Integer id;
    public String templateAttributeName;
    public AttributeType templateAttributeType;
    public Integer templateId;

    public TemplateAttributeDto() {
    }

    //fuer create with parent id 
    public TemplateAttributeDto(String attributeName, AttributeType attributeType, Integer templateId){
        this.templateAttributeName = attributeName;
        this.templateAttributeType = attributeType;
        this.templateId = templateId;
    }

    public TemplateAttributeDto(Integer attributeId, String attributeName, AttributeType attributeType, Integer templateId) {
        this.id = attributeId;
        this.templateAttributeName = attributeName;
        this.templateAttributeType = attributeType;
    }
}
