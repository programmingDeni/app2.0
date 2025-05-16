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
    @JoinColumn(name = "machine_template_id", nullable = false)
    private MachineTemplate machineTemplate;

    protected AttributeInTemplate() {}

    public AttributeInTemplate(String name, AttributeType type, MachineTemplate template) {
        setAttributeInTemplateName(name);
        setType(type);
        setMachineTemplate(template);
    }

    // Getter & Setter
    public int getId() {
        return id;
    }

    public String getAttributeInTemplateName() {
        return attributeInTemplateName;
    }

    public void setAttributeInTemplateName(String attributeInTemplateName) {
        if (attributeInTemplateName == null || attributeInTemplateName.trim().isEmpty()) {
            throw new IllegalArgumentException("Attributname darf nicht leer sein");
        }
        this.attributeInTemplateName = attributeInTemplateName.trim();
    }

    public AttributeType getType() {
        return type;
    }

    public void setType(AttributeType type) {
        if (type == null) {
            throw new IllegalArgumentException("AttributeType darf nicht null sein");
        }
        this.type = type;
    }

    public MachineTemplate getMachineTemplate() {
        return machineTemplate;
    }

    public void setMachineTemplate(MachineTemplate template) {
        if (template == null) {
            throw new IllegalArgumentException("Template darf nicht null sein");
        }
        
        // Alte Referenz entfernen
        if (this.machineTemplate != null) {
            this.machineTemplate.getAttributeTemplates().remove(this);
        }
        
        // Neue Referenz setzen
        this.machineTemplate = template;
        if (!template.getAttributeTemplates().contains(this)) {
            template.getAttributeTemplates().add(this);
        }
    }

}
