package com.example.machine_management.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "attribute_value")
public class AttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "attribute_value")
    private String attributeValue;

    private int year;

    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_attribute_id", nullable = false)
    private MachineAttribute machineAttribute;

    protected AttributeValue() {}

    //Konstruktor mit Jahr
    public AttributeValue(MachineAttribute machineAttribute, int year){
        this.machineAttribute = machineAttribute;
        this.year = year;
        machineAttribute.getAttributeValues().add(this);
        attributeValue = "";
    }

    //Initialisuerung mit Wert 
    public AttributeValue (MachineAttribute machineAttribute, int year, String value){
        this(machineAttribute, year);
        this.attributeValue = value;
    }

    public int getId() {
        return id;
    }

    public String getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(String value) {
        this.attributeValue = value;
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