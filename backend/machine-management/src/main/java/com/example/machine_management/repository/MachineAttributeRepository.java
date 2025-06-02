package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MachineAttributeRepository extends JpaRepository<MachineAttribute, Integer> {
    List<MachineAttribute> findByMachine(Machine machine);    

    @Query("SELECT ma FROM MachineAttribute ma LEFT JOIN FETCH ma.attributeValues WHERE ma.id = :id")
    Optional<MachineAttribute> findByIdWithValues(@Param("id") Integer id);

    
    List<MachineAttribute> findAllMachineAttributesByMachineId(Integer machineId);

} 