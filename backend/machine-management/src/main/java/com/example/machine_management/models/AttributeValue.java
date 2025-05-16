package com.example.machine_management.models;

import jakarta.persistence.Entity;

@Entity
public class AttributeValue {
    private String value;

    private int year;

    private MachineAttribute machineAttribute;

    protected AttributeValue() {}

    public AttributeValue(MachineAttribute machineAttribute, int year){
        this.machineAttribute = machineAttribute;
        this.year = year;
        machineAttribute.getAttributeValues().add(this);
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public MachineAttribute getMachineAttribute() {
        return machineAttribute;
    }

    public void setMachineAttribute(MachineAttribute machineAttribute) {
        this.machineAttribute = machineAttribute;
    }
}