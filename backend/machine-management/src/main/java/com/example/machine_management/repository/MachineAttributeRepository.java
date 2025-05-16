package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MachineAttributeRepository extends JpaRepository<MachineAttribute, Integer> {
    List<MachineAttribute> findByMachine(Machine machine);    
} 