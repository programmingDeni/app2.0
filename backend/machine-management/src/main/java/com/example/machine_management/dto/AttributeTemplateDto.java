// AttributeTemplateDto.java
package com.example.machine_management.dto;

public class AttributeTemplateDto {
    public Integer id;
    public String attributeInTemplateName;
    public String attributeInTemplateType;

    public AttributeTemplateDto() {}

    public AttributeTemplateDto(Integer id, String attributeTemplateName, String attributeTemplateType) {
        this.id = id;
        this.attributeInTemplateName = attributeTemplateName;
        this.attributeInTemplateType = attributeTemplateType;
    }
}