package com.example.machine_management.models;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

//import com.example.machine_management.models.MachineAttributes;

@Entity
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String machineName;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "machine")
    //@JoinColumn(name = "machine_id") // FK in MachineAttributes
    private List<MachineAttribute> machineAttributes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "template_id")
    private MachineTemplate machineTemplate;

    //Constructors
    public Machine () {}

    public Machine (String name){
        this.machineName = name;
    }

    //TODO: obsolete? 
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
        if (this.machineAttributes == null) this.machineAttributes = new ArrayList<>();
        this.machineAttributes.add(attribute);
        attribute.setMachine(this);
    }

    public void removeAttribute(MachineAttribute attribute) {
        if (this.machineAttributes != null) {
            this.machineAttributes.remove(attribute);
            attribute.setMachine(null);
        }
    }

    public void setMachineTemplate(MachineTemplate template) {
        this.machineTemplate = template;
    }

    public MachineTemplate getMachineTemplate() {
        return machineTemplate;
    }

    //TODO: Templates add / remove

}