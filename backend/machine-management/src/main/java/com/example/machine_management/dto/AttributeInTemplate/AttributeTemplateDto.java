// AttributeTemplateDto.java
package com.example.machine_management.dto.AttributeInTemplate;

public class AttributeTemplateDto {
    public Integer id;
    public String templateAttributeName;
    public String templateAttributeType;
    public int machineTemplateId;
    // nur ids in dtos

    public AttributeTemplateDto() {
    }

    public AttributeTemplateDto(Integer id, String attributeTemplateName, String attributeTemplateType,
            int machineTemplateId) {
        this.id = id;
        this.templateAttributeName = attributeTemplateName;
        this.templateAttributeType = attributeTemplateType;
        this.machineTemplateId = machineTemplateId;
    }
}