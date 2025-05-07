package com.example.machine_management.models;

import jakarta.persistence.*;

@Entity
public class MachineAttributes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String attributeName;

    @Enumerated(EnumType.STRING)
    private AttributeType type;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    // Getter + Setter

    public int getId() {
        return id;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public Machine getMachine() {
        return machine;
    }

    public void setMachine(Machine machine) {
        this.machine = machine;
    }

    public AttributeType getType() {
        return type;
    }
    
    public void setType(AttributeType type) {
        this.type = type;
    }
    
}
