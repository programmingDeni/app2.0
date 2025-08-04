package com.example.machine_management.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;

import jakarta.persistence.*;

@Entity
public class MachineAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String attributeName;

    @Enumerated(EnumType.STRING)
    private AttributeType type;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "machineAttribute")
    private List<AttributeValue> attributeValues = new ArrayList<>();

    private Integer machineId;

    private boolean fromTemplate = false;

    // Constructors

    // protected MachineAttribute() {}
    public MachineAttribute() {
    }

    // initialisierung ohne type
    public MachineAttribute(Integer machineId, String attributeName) {
        if (machineId == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.machineId = machineId;
        this.attributeName = attributeName;
    }

    // Initialisierung mit Integer statt Machine
    // machine und attribute id
    public MachineAttribute(Integer machineId, Integer attributeId) {
        if (attributeId == null || attributeId <= 0) {
            throw new IllegalArgumentException("AttributeID darf nicht null oder leer sein");
        }
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("MachineID darf nicht null oder leer sein");
        }
        this.id = attributeId;
        this.machineId = machineId;
    }

    public MachineAttribute(Integer machineId, String attributeName, AttributeType type) {
        this.machineId = machineId;
        this.attributeName = attributeName;
        this.type = type;
    }

    // initialisierung vom Template ohne values
    public MachineAttribute(Integer machineId, String attributeName, AttributeType type, boolean fromTemplate) {
        this(machineId, attributeName, type);
        this.fromTemplate = fromTemplate;
    }

    // Getter + Setter

    public int getId() {
        return id;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.attributeName = attributeName;
    }

    public Integer getMachineId() {
        return machineId;
    }

    public void setMachineId(Integer newMachine) {
        // passiert so eigentlich nicht, attribute werden nicht von einer machine zur
        // anderen geschoben
        if (newMachine == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }
        // Setze neue Machine
        this.machineId = newMachine;
    }

    public AttributeType getType() {
        return type;
    }

    public void setType(AttributeType type) {
        if (type == null) {
            throw new IllegalArgumentException("Type darf nicht null sein");
        }
        this.type = type;
    }

    public List<AttributeValue> getAttributeValues() {
        return attributeValues;
    }

    public void setAttributeValues(List<AttributeValue> attributeValues) {
        // Wenn null übergeben wurde → leere Liste setzen
        this.attributeValues = new ArrayList<>();

        if (attributeValues != null) {
            for (AttributeValue attributeValue : attributeValues) {
                this.attributeValues.add(attributeValue);
                attributeValue.setMachineAttribute(this); // Bidirektionale Beziehung setzen
            }
        }
    }

    public void addAttributeValue(AttributeValue attributeValue) {
        if (attributeValue == null) {
            throw new IllegalArgumentException("AttributeValue darf nicht leer sein");
        }
        this.attributeValues.add(attributeValue);
    }

    public boolean getFromTemplate() {
        return fromTemplate;
    }

    public void setFromTemplate(boolean fromTemplate) {
        this.fromTemplate = fromTemplate;
    }

    private void validateValueForType(String value) {
        try {
            switch (type) {
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
                    throw new IllegalArgumentException("Unbekannter AttributeType: " + type);
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Wert '" + value + "' ist nicht valid für Typ " + type);
        }
    }

}
