package com.example.machine_management.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class MachineTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String templateName;

    @OneToMany(mappedBy = "machineTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttributeInTemplate> attributeTemplates = new ArrayList<>();

    public MachineTemplate() {}

    public MachineTemplate(String templateName) {
        setTemplateName(templateName);
    }

    // Getter & Setter
    public Integer getId() {
        return id;
    }

    public String getTemplateName() {
        return templateName;
    }

    public List<AttributeInTemplate> getAttributeTemplates() {
        return attributeTemplates;
    }
    
    public void setAttributeTemplates(List<AttributeInTemplate> attrs) {
        this.attributeTemplates = new ArrayList<>(attrs); // immer kopieren!
        if (attrs != null) {
            for (AttributeInTemplate attr : attrs) {
                attr.setMachineTemplate(this);
            }
        }
    }


    // Setter mit Basis-Validierung
    public void setTemplateName(String templateName) {
        if (templateName == null || templateName.trim().isEmpty()) {
            throw new IllegalArgumentException("Templatename darf nicht leer sein");
        }
        this.templateName = templateName.trim();
    }

    //Entitäts Methdoen
    public void addAttribute(AttributeInTemplate attr) {
        this.attributeTemplates.add(attr);
        attr.setMachineTemplate(this); // bidirektional setzen
    }

    public void removeAttribute(AttributeInTemplate attr) {
        this.attributeTemplates.remove(attr);
        attr.setMachineTemplate(null);
    }

}
