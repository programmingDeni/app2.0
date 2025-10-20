package com.example.machine_management.models;

import java.time.LocalDateTime;

// past or present validation
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Getter
@Table(name = "attribute_value")
public class AttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String attributeValue;

    @Column(name = "attribute_value_year", nullable = false)
    private int attributeValueYear;

    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_attribute_id", nullable = false)
    private MachineAttribute machineAttribute;

    @NotNull
    @Column(nullable = false, name = "pruefungs_intervall")
    private Integer pruefungsIntervall = 365; // Default 

    //pastorpresent von wo importieren?
    @PastOrPresent 
    @Column(name = "zuletzt_geprueft")
    private LocalDateTime zuletztGeprueft;

    @PastOrPresent
    @Column(name = "zuletzt_getauscht")
    private LocalDateTime zuletztGetauscht;

    @PrePersist
    public void initTimestamps() {
        LocalDateTime now = LocalDateTime.now();
        if (zuletztGeprueft == null) zuletztGeprueft = now;
        if (zuletztGetauscht == null) zuletztGetauscht = now;
    }





    protected AttributeValue() {}

    //Konstruktor mit Jahr
    public AttributeValue(MachineAttribute machineAttribute, int year){
        this.machineAttribute = machineAttribute;
        this.attributeValueYear = year;
        machineAttribute.getAttributeValues().add(this);
        attributeValue = "";
    }

    //Initialisuerung mit Wert 
    public AttributeValue (MachineAttribute machineAttribute, int year, String value, Integer pruefungsIntervall){
        this(machineAttribute, year);
        this.attributeValue = value;
        this.pruefungsIntervall = pruefungsIntervall;
    }

    public void setAttributeValue(String value) {
        this.attributeValue = value;
    }


    public void setAttributeValueYear(int year) {
        this.attributeValueYear = year;
    }

    public MachineAttribute getMachineAttribute() {
        return machineAttribute;
    }

    public void setMachineAttribute(MachineAttribute machineAttribute) {
        this.machineAttribute = machineAttribute;
    }
}