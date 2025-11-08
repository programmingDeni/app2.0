package com.example.machine_management.models;

import java.util.ArrayList;
import java.util.List;

import com.example.machine_management.util.SecurityUtils;

import jakarta.persistence.*;

//import com.example.machine_management.models.MachineAttributes;

@Entity
public class Machine extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String machineName;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "machineId") // FK in MachineAttributes
    private List<MachineAttribute> machineAttributes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "template_id")
    private MachineTemplate machineTemplate;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    // Constructors
    public Machine() {
    }

    public Machine(String name) {
        this.machineName = name;
    }

    // TODO: obsolete?
    public Machine(String name, MachineTemplate template) {
        this(name);
        this.machineTemplate = template;
    }

    public Integer getId() {
        return id;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String name) {
        this.machineName = name;
    }

    public List<MachineAttribute> getMachineAttributes() {
        return machineAttributes;
    }

    public void setMachineAttributes(List<MachineAttribute> attributes) {
        this.machineAttributes = attributes;
    }

    public void addAttribute(MachineAttribute attribute) {
        if (this.machineAttributes == null)
            this.machineAttributes = new ArrayList<>();
        this.machineAttributes.add(attribute);
        attribute.setMachineId(this.id);
    }

    public void removeAttribute(MachineAttribute attribute) {
        if (this.machineAttributes != null) {
            this.machineAttributes.remove(attribute);
            attribute.setMachineId(null);
        }
    }

    public void setMachineTemplate(MachineTemplate template) {
        this.machineTemplate = template;
    }

    public MachineTemplate getMachineTemplate() {
        return machineTemplate;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return userId;
    }

    /**
     * JPA Lifecycle Hook: Automatically set userId before persisting
     * Gets userId from SecurityContext
     */
    @PrePersist
    protected void setUserIdFromSecurityContext() {
        if (this.userId == null) {
            try {
                this.userId = SecurityUtils.getCurrentUserId();
            } catch (Exception e) {
                // If no user is authenticated (e.g., system operations),
                // userId must be set manually
            }
        }
    }

    // TODO: Templates add / remove

}