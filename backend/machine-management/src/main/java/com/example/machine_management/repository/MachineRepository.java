package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Integer> {
    Optional<Machine> findByMachineName(String name);

    @EntityGraph(attributePaths = {
    "machineAttributes",                         // Machine → MachineAttributes
    "machineTemplate"        // Wenn Attribute selbst Werte haben
    })
    Optional<Machine> findWithAllDataById(Integer id);

}
