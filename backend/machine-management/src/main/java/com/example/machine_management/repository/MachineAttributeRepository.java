package com.example.machine_management.repository;

import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MachineAttributeRepository extends JpaRepository<MachineAttribute, Integer> {

    // ============= User-filtered queries (LAZY) =============
    @Query("SELECT ma FROM MachineAttribute ma WHERE ma.id = :id AND ma.userId = :userId")
    Optional<MachineAttribute> lazyFindByIdAndUserId(Integer id, Integer userId);
    
        @Query("SELECT ma FROM MachineAttribute ma WHERE ma.machine.id = :machineId AND ma.userId = :userId")
    List<MachineAttribute> lazyFindByMachineIdAndUserId(@Param("machineId") Integer machineId, @Param("userId") Integer userId);
    
    // ============= User-filtered queries (EEAGER) =============


      /**
     * Find MachineAttribute by ID and userId WITH AttributeValues (eager loading)
     */
    @EntityGraph(attributePaths = {"attributeValues"})
    @Query("SELECT ma FROM MachineAttribute ma WHERE ma.id = :id AND ma.userId = :userId")
    Optional<MachineAttribute> eagerFindByIdAndUserId(@Param("id") Integer id, @Param("userId") Integer userId);
   
    

    /**
     * Find all MachineAttributes by userId WITH AttributeValues (eager loading)
     */
    @EntityGraph(attributePaths = {"attributeValues"})
    @Query("SELECT ma FROM MachineAttribute ma WHERE ma.userId = :userId")
    List<MachineAttribute> eagerFindByUserId(@Param("userId") Integer userId);

    /**
     * Find all MachineAttributes by machineId and userId WITH AttributeValues (eager loading)
     */
    @EntityGraph(attributePaths = {"attributeValues"})
    @Query("SELECT ma FROM MachineAttribute ma WHERE ma.machine.id = :machineId AND ma.userId = :userId")
    List<MachineAttribute> eagerFindByMachineIdAndUserId(@Param("machineId") Integer machineId, @Param("userId") Integer userId);
}