package com.example.machine_management.models;

import jakarta.persistence.*;

//import com.example.machine_management.models.MachineTemplate;

@Entity
public class AttributeInTemplate {
    //Attribute
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String attributeInTemplateName;

    @Enumerated(EnumType.STRING)
    private AttributeType type;

    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private MachineTemplate machineTemplate;

    // Getter & Setter
    public int getId() {
        return id;
    }

    public String getAttributeInTemplateName() {
        return attributeInTemplateName;
    }

    public void setAttributeInTemplateName(String attributeInTemplate) {
        this.attributeInTemplateName = attributeInTemplate;
    }

    public AttributeType getType() {
        return type;
    }

    public void setType(AttributeType type) {
        this.type = type;
    }

    public MachineTemplate getMachineTemplate() {
        return machineTemplate;
    }

    public void setMachineTemplate(MachineTemplate machineTemplate) {
        this.machineTemplate = machineTemplate;
    }

}
