package com.example.machine_management.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class MachineTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String templateName;

    @OneToMany(mappedBy = "machineTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttributeInTemplate> attributes = new ArrayList<>();

    // Getter & Setter
    public int getId() {
        return id;
    }

    public String getTemplateName() {
        return templateName;
    }

    public List<AttributeInTemplate> getAttributeTemplates() {
        return attributes;
    }

    // Setter mit Basis-Validierung
    public void setTemplateName(String templateName) {
        if (templateName == null || templateName.trim().isEmpty()) {
            throw new IllegalArgumentException("Templatename darf nicht leer sein");
        }
        this.templateName = templateName.trim();
    }

    //
}
