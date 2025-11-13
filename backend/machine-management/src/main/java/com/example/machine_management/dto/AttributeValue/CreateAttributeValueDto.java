package com.example.machine_management.dto.AttributeValue;

public class CreateAttributeValueDto {
    public Integer attributeId;
    public String attributeValue;
    public int attributeValueYear;
    public Integer pruefungsIntervall;

    public CreateAttributeValueDto() {
    }

    public CreateAttributeValueDto( Integer attributeId, String attributeValue,
            int attributeValueYear, Integer pruefungsIntervall) {
        this.attributeId = attributeId;
        this.attributeValue = attributeValue;
        this.attributeValueYear = attributeValueYear;
        this.pruefungsIntervall = pruefungsIntervall;
    }

}
