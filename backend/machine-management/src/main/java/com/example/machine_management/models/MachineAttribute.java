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

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    private boolean fromTemplate = false;

    // Constructors

    // protected MachineAttribute() {}
    public MachineAttribute() {
    }

    // initialisierung ohne type
    public MachineAttribute(Machine besitzendeMachine, String attributeName) {
        if (besitzendeMachine == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.machine = besitzendeMachine;
        this.attributeName = attributeName;
        besitzendeMachine.getMachineAttributes().add(this);
    }

    // initialisierung mit type
    public MachineAttribute(Machine besitzendeMachine, String attributeName, AttributeType type) {
        this(besitzendeMachine, attributeName);
        this.type = type;
    }

    // initialisierung vom Template ohne values
    public MachineAttribute(Machine besitzendeMachine, String attributeName, AttributeType type, boolean fromTemplate) {
        this(besitzendeMachine, attributeName, type);
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

    public Machine getMachine() {
        return machine;
    }

    public void setMachine(Machine newMachine) {
        if (newMachine == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }

        // Entferne dieses Attribut von der alten Machine
        if (this.machine != null && this.machine != newMachine) {
            this.machine.getMachineAttributes().remove(this);
        }

        // Setze neue Machine
        this.machine = newMachine;

        // Füge dieses Attribut zur neuen Machine hinzu
        if (!newMachine.getMachineAttributes().contains(this)) {
            newMachine.getMachineAttributes().add(this);
        }
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
