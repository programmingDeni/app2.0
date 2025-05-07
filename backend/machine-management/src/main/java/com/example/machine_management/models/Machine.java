package com.example.machine_management.models;

import java.util.List;
import jakarta.persistence.*;

import com.example.machine_management.models.MachineAttributes;

@Entity
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String name;

    //private List<MachineAttributes> attributes;

    //Constructors
    public Machine () {}

    public Machine (String name){
        this.name = name;
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

}