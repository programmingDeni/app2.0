package com.example.machine_management.dto.AttributeValue;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AttributeValueDto {
    public Integer id;
    public int attributeValueYear;
    public Integer machineAttributeId;
    public String attributeValue;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime zuletztGeprueft;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime zuletztGetauscht;

    public AttributeValueDto() {
    }

    //construktor fuer create mit parent id 
    public AttributeValueDto(int attributeValueYear, Integer machineAttributeId, String attributeValue){
        this.attributeValueYear = attributeValueYear;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = attributeValue;
    }

    public AttributeValueDto(Integer id, int attributeValueYear, Integer machineAttributeId) {
        this.id = id;
        this.attributeValueYear = attributeValueYear;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = "";
    }

    public AttributeValueDto(Integer id, int year, Integer machineAttributeId,
            String attributeValue,
            LocalDateTime zuletztGeprueft, LocalDateTime zuletztGetauscht) {
        this.id = id;
        this.attributeValueYear = year;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = attributeValue;
        this.zuletztGeprueft = zuletztGeprueft;
        this.zuletztGetauscht = zuletztGetauscht;
    }
}