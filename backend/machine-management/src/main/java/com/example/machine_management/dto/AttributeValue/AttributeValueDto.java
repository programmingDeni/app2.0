package com.example.machine_management.dto.AttributeValue;

import java.time.LocalDateTime;

import com.example.machine_management.models.MachineAttribute;
import com.fasterxml.jackson.annotation.JsonFormat;

public class AttributeValueDto {
    public Integer id;
    public int attributeValueYear;
    public Integer machineAttributeId;
    public String attributeValue;
    public Integer pruefungsIntervall;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime zuletztGeprueft;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime zuletztGetauscht;

    public AttributeValueDto() {
    }

    public AttributeValueDto(Integer id, int attributeValueYear, Integer machineAttributeId) {
        this.id = id;
        this.attributeValueYear = attributeValueYear;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = "";
    }

    public AttributeValueDto(Integer id, int year, Integer machineAttributeId, 
    String attributeValue, Integer pruefungsIntervall, 
    LocalDateTime zuletztGeprueft, LocalDateTime zuletztGetauscht) {
        this.id = id;
        this.attributeValueYear = year;
        this.machineAttributeId = machineAttributeId;
        this.attributeValue = attributeValue;
        this.pruefungsIntervall = pruefungsIntervall;
        this.zuletztGeprueft = zuletztGeprueft;
        this.zuletztGetauscht = zuletztGetauscht;
    }
}