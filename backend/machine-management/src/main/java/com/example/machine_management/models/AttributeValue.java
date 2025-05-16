package com.example.machine_management.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.*;

@Entity
@Table(
    name = "attribute_value",
    uniqueConstraints = @UniqueConstraint(columnNames = {"machine_attribute_id", "year"})
)
public class AttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String value;

    private int year;

    @ManyToOne
    @JoinColumn(name="machine_attribute_id", nullable = false)
    private MachineAttribute machineAttribute;

    protected AttributeValue() {}

    public AttributeValue(MachineAttribute machineAttribute, int year){
        this.machineAttribute = machineAttribute;
        this.year = year;
        machineAttribute.getAttributeValues().add(this);
    }

    public int getId() {
        return id;
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