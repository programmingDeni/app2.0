package com.example.machine_management.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class MachineTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String templateName;

    @OneToMany(mappedBy = "machineTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttributeInTemplate> attributes;

    // Getter & Setter
    public int getId() {
        return id;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public List<AttributeInTemplate> getAttributeTemplates() {
        return attributes;
    }

    public void setAttributeTemplates(List<AttributeInTemplate> attributes) {
        this.attributes = attributes;
    }   
}
