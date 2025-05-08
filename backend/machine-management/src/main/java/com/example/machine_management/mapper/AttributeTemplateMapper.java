// AttributeTemplateMapper.java
package com.example.machine_management.mapper;

import com.example.machine_management.dto.*;
import com.example.machine_management.models.*;

public class AttributeTemplateMapper {

    public static AttributeTemplateDto toDto(AttributeInTemplate attr) {
        AttributeTemplateDto dto = new AttributeTemplateDto();
        dto.id = attr.getId();
        dto.attributeInTemplateName = attr.getAttributeInTemplateName();
        dto.attributeInTemplateType = attr.getType().toString();
        return dto;
    }
}
