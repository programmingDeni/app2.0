package com.example.machine_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.example.machine_management.models.machine.AttributeValue;
import com.example.machine_management.models.machine.MachineAttribute;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    // ============= User-filtered queries =============

    List<AttributeValue> findByUserId(Integer userId);

    Optional<AttributeValue> findByIdAndUserId(Integer id, Integer userId);

    @Query("SELECT av FROM AttributeValue av WHERE av.machineAttribute.id = :machineAttributeId AND av.userId = :userId")
    List<AttributeValue> lazyFindByMachineAttributeIdAndUserId(@Param("machineAttributeId") Integer machineAttributeId, @Param("userId") Integer userId);

    Optional<AttributeValue> findByMachineAttributeAndAttributeValueYear(MachineAttribute machineAttribute,
            Integer year);

}
