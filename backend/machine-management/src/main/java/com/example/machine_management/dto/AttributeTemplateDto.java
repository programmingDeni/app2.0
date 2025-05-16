// AttributeTemplateDto.java
package com.example.machine_management.dto;

public class AttributeTemplateDto {
    public Integer id;
    public String attributeInTemplateName;
    public String attributeInTemplateType;
    public int machineTemplateId;

    public AttributeTemplateDto() {}

    public AttributeTemplateDto(Integer id, String attributeTemplateName, String attributeTemplateType, int machineTemplateId) {
        this.id = id;
        this.attributeInTemplateName = attributeTemplateName;
        this.attributeInTemplateType = attributeTemplateType;
        this.machineTemplateId = machineTemplateId;
    }
}