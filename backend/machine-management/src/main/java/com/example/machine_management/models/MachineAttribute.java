package com.example.machine_management.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Entity
@Getter
public class MachineAttribute extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String attributeName;

    @Enumerated(EnumType.STRING)
    private AttributeType type;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "machineAttribute")
    private List<AttributeValue> attributeValues = new ArrayList<>();

    // TODO: hier auf iene machine verweisen nicht auf die ID
    private Integer machineId;

    private boolean fromTemplate = false;

    @NotNull
    @Column(nullable = false, name = "pruefungs_intervall")
    private Integer pruefungsIntervall = 365; // Default

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

    // Setter

    public void setAttributeName(String attributeName) {
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.attributeName = attributeName;
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

    public void setType(AttributeType type) {
        if (type == null) {
            throw new IllegalArgumentException("Type darf nicht null sein");
        }
        this.type = type;
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

    public void setPruefungsIntervall(Integer pruefungsIntervall) {
        this.pruefungsIntervall = pruefungsIntervall;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
