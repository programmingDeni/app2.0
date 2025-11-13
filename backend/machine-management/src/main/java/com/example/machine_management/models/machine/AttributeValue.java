package com.example.machine_management.models.machine;

import java.time.LocalDateTime;

import com.example.machine_management.models.base.AuditableEntity;
import com.example.machine_management.models.base.UserOwned;

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
public class AttributeValue extends AuditableEntity implements UserOwned {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String attributeValue;

    //TODO: muss nicht das values objekt den typ kennen fuer die validierung? 

    @Column(name = "attribute_value_year", nullable = false)
    private Integer attributeValueYear;

    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_attribute_id", nullable = false)
    private MachineAttribute machineAttribute;

    // pastorpresent von wo importieren?
    @PastOrPresent
    @Column(name = "zuletzt_geprueft")
    private LocalDateTime zuletztGeprueft;

    @PastOrPresent
    @Column(name = "zuletzt_getauscht")
    private LocalDateTime zuletztGetauscht;

    @PrePersist
    public void initTimestamps() {
        LocalDateTime now = LocalDateTime.now();
        if (zuletztGeprueft == null)
            zuletztGeprueft = now;
        if (zuletztGetauscht == null)
            zuletztGetauscht = now;
    }

    protected AttributeValue() {
    }

    // Konstruktor mit Jahr
    public AttributeValue(MachineAttribute machineAttribute, int year) {
        this.machineAttribute = machineAttribute;
        this.attributeValueYear = year;
    }

    // Initialisuerung mit Wert
    public AttributeValue(MachineAttribute machineAttribute, int year, String value) {
        this(machineAttribute, year);
        this.attributeValue = value;
    }

    public void setAttributeValue(String value) {
        this.attributeValue = value;
    }

    public MachineAttribute getMachineAttribute() {
        return machineAttribute;
    }

    public void setMachineAttribute(MachineAttribute machineAttribute) {
        this.machineAttribute = machineAttribute;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setAttributeValueYear(Integer attributeValueYear) {
        this.attributeValueYear = attributeValueYear;
    }

    public void setZuletztGeprueft(LocalDateTime zuletztGeprueft) {
        this.zuletztGeprueft = zuletztGeprueft;
    }

    public void setZuletztGetauscht(LocalDateTime zuletztGetauscht) {
        this.zuletztGetauscht = zuletztGetauscht;
    }
    /*
     * 
     
    private void validateValueForType(String value) {
            try {
                switch (attributeType) {
                    case INTEGER:
                        Integer.parseInt(value);
                        break;
                    case BOOLEAN:
                        if (!value.equalsIgnoreCase("true") && !value.equalsIgnoreCase("false")) {
                            throw new IllegalArgumentException();
                        }
                        break;
                    case STRING:
                        // Strings sind immer valid
                        break;
                    default:
                        throw new IllegalArgumentException("Unbekannter AttributeType: " + attributeType);
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "Wert '" + value + "' ist nicht valid für Typ " + attributeType);
            }
        }
            */
}