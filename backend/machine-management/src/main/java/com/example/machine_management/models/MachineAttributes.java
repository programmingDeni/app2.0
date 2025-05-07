package com.example.machine_management.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

//import jakarta.persistence.*;
@Entity
public class MachineAttributes {
    @Id
    private int id;
    
    private String attributeName;
}
