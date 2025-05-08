package com.example.machine_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.machine_management.models.MachineTemplate;

public interface MachineTemplateRepository extends JpaRepository<MachineTemplate, Integer> {

    
} 