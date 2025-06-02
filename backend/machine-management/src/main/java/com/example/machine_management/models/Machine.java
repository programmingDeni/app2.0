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
    private String name;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "machine")
    //@JoinColumn(name = "machine_id") // FK in MachineAttributes
    private List<MachineAttribute> attributes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "template_id")
    private MachineTemplate template;

    //Constructors
    public Machine () {}

    public Machine (String name){
        this.name = name;
    }

    public Machine(String name, MachineTemplate template) {
        this(name);
        this.template = template;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }    

    public List<MachineAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<MachineAttribute> attributes) {
        this.attributes = attributes;
    }

    public void addAttribute(MachineAttribute attribute) {
        if (this.attributes == null) this.attributes = new ArrayList<>();
        this.attributes.add(attribute);
        attribute.setMachine(this);
    }

    public void removeAttribute(MachineAttribute attribute) {
        if (this.attributes != null) {
            this.attributes.remove(attribute);
            attribute.setMachine(null);
        }
    }

    public void setTemplate(MachineTemplate template) {
        this.template = template;
    }

    public MachineTemplate getTemplate() {
        return template;
    }

    //TODO: Templates add / remove

}