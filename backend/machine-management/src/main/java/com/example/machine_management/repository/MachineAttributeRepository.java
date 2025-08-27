package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MachineAttributeRepository extends JpaRepository<MachineAttribute, Integer> {
    List<MachineAttribute> findByMachineId(Integer machineId);

    @Query("SELECT a FROM MachineAttribute a LEFT JOIN FETCH a.attributeValues WHERE a.machineId = :machineId")
    List<MachineAttribute> findAttributesWithValues(@Param("machineId") Integer machineId);

    List<MachineAttribute> findAllMachineAttributesByMachineId(Integer machineId);

}