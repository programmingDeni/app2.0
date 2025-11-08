package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MachineAttributeRepository extends JpaRepository<MachineAttribute, Integer> {

    // ============= User-filtered queries =============

    List<MachineAttribute> findByUserId(Integer userId);

    Optional<MachineAttribute> findByIdAndUserId(Integer id, Integer userId);

    List<MachineAttribute> findByMachineIdAndUserId(Integer machineId, Integer userId);

    List<MachineAttribute> findAttributesWithValuesByMachineIdAndUserId(Integer machineId, Integer userId);

    // ============= Legacy queries =============
    /*
     * List<MachineAttribute> findByMachineId(Integer machineId);
     * 
     * @Query("SELECT a FROM MachineAttribute a LEFT JOIN FETCH a.attributeValues WHERE a.machineId = :machineId"
     * )
     * List<MachineAttribute> findAttributesWithValues(@Param("machineId") Integer
     * machineId);
     * 
     * List<MachineAttribute> findAllMachineAttributesByMachineId(Integer
     * machineId);
     */
}