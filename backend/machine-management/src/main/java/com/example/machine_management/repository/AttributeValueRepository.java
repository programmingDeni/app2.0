package com.example.machine_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.example.machine_management.models.AttributeValue;
import com.example.machine_management.models.MachineAttribute;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    //muss auf jeden fall möglich sein über das machinheneAttribute zu fidnen 
    List<AttributeValue> findAllByMachineAttribute(MachineAttribute machineAttribute);
    List<AttributeValue> findAllByAttributeValueYear(int year);
    Optional<AttributeValue> findByMachineAttributeAndAttributeValueYear(MachineAttribute machineAttribute, int year);

    List<AttributeValue>findByMachineAttributeId(Integer machineAttributeId);
    List<AttributeValue> findByMachineAttributeMachineId(Integer machineId);
}
