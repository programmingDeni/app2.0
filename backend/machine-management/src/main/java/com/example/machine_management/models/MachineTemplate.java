package com.example.machine_management.models;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class MachineTemplate extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String templateName;

    @OneToMany(mappedBy = "machineTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TemplateAttribute> attributeTemplates = new ArrayList<>();

    public MachineTemplate() {
    }

    public MachineTemplate(String templateName) {
        setTemplateName(templateName);
    }

    // Setter
    public void setAttributeTemplates(List<TemplateAttribute> attrs) {
        this.attributeTemplates = new ArrayList<>(attrs); // immer kopieren!
        if (attrs != null) {
            for (TemplateAttribute attr : attrs) {
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

    // Entitäts Methdoen
    public void addAttribute(TemplateAttribute attr) {
        this.attributeTemplates.add(attr);
        attr.setMachineTemplate(this); // bidirektional setzen
    }

    public void removeAttribute(TemplateAttribute attr) {
        this.attributeTemplates.remove(attr);
        attr.setMachineTemplate(null);
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

}
