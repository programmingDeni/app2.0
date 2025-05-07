package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Integer> {
    
}
