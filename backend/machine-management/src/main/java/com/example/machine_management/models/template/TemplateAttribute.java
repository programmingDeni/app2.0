package com.example.machine_management.models.template;

import com.example.machine_management.models.base.AuditableEntity;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.models.enums.AttributeType;

import jakarta.persistence.*;
import lombok.Getter;

//import com.example.machine_management.models.MachineTemplate;

@Entity
@Getter
public class TemplateAttribute extends AuditableEntity implements UserOwned{
    // Attribute
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String attributeInTemplateName;

    @Enumerated(EnumType.STRING)
    private AttributeType type;

    @ManyToOne
    @JoinColumn(name = "machine_template_id", nullable = false)
    private MachineTemplate machineTemplate;

    public TemplateAttribute() {
    }

    public TemplateAttribute(String name, AttributeType type, MachineTemplate template) {
        setAttributeInTemplateName(name);
        setType(type);
        setMachineTemplate(template);
    }

    // Setter

    public void setAttributeInTemplateName(String attributeInTemplateName) {
        if (attributeInTemplateName == null || attributeInTemplateName.trim().isEmpty()) {
            throw new IllegalArgumentException("Attributname darf nicht leer sein");
        }
        this.attributeInTemplateName = attributeInTemplateName.trim();
    }

    public void setType(AttributeType type) {
        if (type == null) {
            throw new IllegalArgumentException("AttributeType darf nicht null sein");
        }
        this.type = type;
    }

    public void setMachineTemplate(MachineTemplate template) {
        if (template == null) {
            throw new IllegalArgumentException("Template darf nicht null sein");
        }

        // Alte Referenz entfernen
        if (this.machineTemplate != null) {
            this.machineTemplate.getTemplateAttributes().remove(this);
        }

        // Neue Referenz setzen
        this.machineTemplate = template;
        if (!template.getTemplateAttributes().contains(this)) {
            template.getTemplateAttributes().add(this);
        }
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

}
