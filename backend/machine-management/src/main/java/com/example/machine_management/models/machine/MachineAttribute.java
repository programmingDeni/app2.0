package com.example.machine_management.models.machine;

import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.models.base.AuditableEntity;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.models.enums.AttributeType;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Entity
@Getter
public class MachineAttribute extends AuditableEntity implements UserOwned{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String attributeName;

    @Enumerated(EnumType.STRING)
    private AttributeType attributeType;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "machineAttribute")
    private List<AttributeValue> attributeValues = new ArrayList<>();

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="machine_id")
    private Machine machine;

    private boolean fromTemplate = false;

    @NotNull
    @Column(nullable = false, name = "pruefungs_intervall")
    private Integer pruefungsIntervall = 365; // Default

    // Constructors

    // protected MachineAttribute() {}
    public MachineAttribute() {
    }

    public MachineAttribute(Integer userId, String attributeName, 
    AttributeType attributeType, List<AttributeValue> attributeValues, 
    Machine machine, Boolean fromTemplate, Integer pruefungsIntervall) {
        if (machine == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.userId = userId;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValues = attributeValues;
        this.machine = machine;
        this.fromTemplate = fromTemplate;
        this.pruefungsIntervall = pruefungsIntervall;
    }

    // Setter

    public void setAttributeName(String attributeName) {
        if (attributeName == null || attributeName.trim().isEmpty()) {
            throw new IllegalArgumentException("AttributeName darf nicht null oder leer sein");
        }
        this.attributeName = attributeName;
    }

    public void setMachine(Machine newMachine) {
        // passiert so eigentlich nicht, attribute werden nicht von einer machine zur
        // anderen geschoben
        if (newMachine == null) {
            throw new IllegalArgumentException("Machine darf nicht null sein");
        }
        // Setze neue Machine
        this.machine = newMachine;
    }

    public void setAttributeType(AttributeType type) {
        if (type == null) {
            throw new IllegalArgumentException("Type darf nicht null sein");
        }
        this.attributeType = type;
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

    public void setFromTemplate(boolean fromTemplate) {
        this.fromTemplate = fromTemplate;
    }

    public void setPruefungsIntervall(Integer pruefungsIntervall) {
        this.pruefungsIntervall = pruefungsIntervall;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

      // ═══════════════════════════════════════════════════════════════
    //  AttributeValue Operations (über MachineAttribute)
    // ═══════════════════════════════════════════════════════════════

    public void addAttributeValue(AttributeValue attributeValue) {
        if (attributeValue == null) {
            throw new IllegalArgumentException("AttributeValue darf nicht leer sein");
        }
        this.attributeValues.add(attributeValue);
        attributeValue.setMachineAttribute(this);
    }

    public void removeAttributeValue(AttributeValue attributeValue) {
        if (attributeValue == null) {
            throw new IllegalArgumentException("AttributeValue darf nicht leer sein");
        }
        this.attributeValues.remove(attributeValue);
        attributeValue.setMachineAttribute(null);
    }

}
