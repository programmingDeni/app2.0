package com.example.machine_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.MachineAttribute;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    // ============= User-filtered queries =============

    List<AttributeValue> findByUserId(Integer userId);

    Optional<AttributeValue> findByIdAndUserId(Integer id, Integer userId);

    List<AttributeValue> findByMachineAttributeIdAndUserId(Integer machineAttributeId, Integer userId);

    Optional<AttributeValue> findByMachineAttributeAndAttributeValueYear(MachineAttribute machineAttribute,
            Integer year);

    List<AttributeValue> findByMachineAttributeMachineIdAndUserId(Integer machineId, Integer userId);
    // ============= Legacy queries =============
    /*
     * // muss auf jeden fall möglich sein über das machinheneAttribute zu fidnen
     * List<AttributeValue> findAllByMachineAttribute(MachineAttribute
     * machineAttribute);
     * 
     * List<AttributeValue> findAllByAttributeValueYear(int year);
     * 
     * Optional<AttributeValue>
     * findByMachineAttributeAndAttributeValueYear(MachineAttribute
     * machineAttribute, int year);
     * 
     * List<AttributeValue> findByMachineAttributeId(Integer machineAttributeId);
     * 
     * List<AttributeValue> findByMachineAttributeMachineId(Integer machineId);
     */
}
