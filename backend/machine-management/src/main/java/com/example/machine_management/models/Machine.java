package com.example.machine_management.models;

import java.util.List;
import jakarta.persistence.*;

import com.example.machine_management.models.MachineAttributes;

@Entity
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    //private List<MachineAttributes> attributes;

    //Constructors
    public Machine () {}

    public Machine (String name){
        this.name = name;
    }

    

}