package com.example.machine_management.repository;

import com.example.machine_management.models.MachineAttributes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineAttributeRepository extends JpaRepository<MachineAttributes, Integer> {

    
} 