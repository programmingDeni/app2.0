package com.example.machine_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.machine_management.models.machine.Machine;

/**
 * Repository für Machine-Entity.
 * 
 * mit user filter
 * LAZY
 * findAllByUserId
 * findByIdAndUserId
 * EAGER
 * findWithAllDataByIdAndUserId
 * findAllByMachineTemplateIdAndUserId
 * 
 * ohne user filter (für Admins)
 * @link findWithAllDataById @see findWithAllDataById 
 * 
 *  @see Machine
 *  @see com.example.machine_management.services.machine.MachineService
 */

public interface MachineRepository extends JpaRepository<Machine, Integer> {

        // ============= User-filtered queries =============

        /**
         * Findet alle Maschinen eines bestimmten Users.
         */
        List<Machine> findAllByUserId(Integer userId);

        // EAGER FindAll 
        @EntityGraph(attributePaths = {
                "machineAttributes",
                "machineAttributes.attributeValues",
                "machineTemplate",
                "machineTemplate.templateAttributes"
        })
        @Query("SELECT m FROM Machine m WHERE m.userId = :userId")
        List<Machine> findAllByUserIdEager(@Param("userId") Integer userId);
        /**
         * Finde machine by ID und userId LAZY
         * Findet eine Maschine by ID UND prüft Ownership (userId).
         * Sicherheitskritisch: Verhindert dass User A Maschine von User B sieht.
         */
        Optional<Machine> findByIdAndUserId(Integer id, Integer userId);

        /**
         * Findet Maschine mit allen Relations (eager loading) UND prüft Ownership.
         * Lädt: Machine, MachineAttributes, AttributeValues, 
         *       MachineTemplate, TemplateAttributes
         */
        @Query("SELECT DISTINCT m FROM Machine m " +
                "LEFT JOIN FETCH m.machineAttributes ma " +
                "LEFT JOIN FETCH ma.attributeValues " +  // ← WICHTIG!
                "LEFT JOIN FETCH m.machineTemplate t " +
                "LEFT JOIN FETCH t.templateAttributes " +  // ← WICHTIG!
                "WHERE m.id = :id AND m.userId = :userId")
        Optional<Machine> findWithAllDataByIdAndUserId(@Param("id") Integer id, @Param("userId") Integer userId);

        @Query("SELECT m FROM Machine m WHERE m.machineTemplate.id = :templateId AND m.userId = :userId")
        List<Machine> findAllByMachineTemplateIdAndUserId(@Param("templateId") Integer templateId, @Param("userId") Integer userId);

        // ============= OHNE User-Filter (für Admins) =============
        
    /**
     * Findet Machine mit ALLEN Relationen (VOLL EAGER Loading) - OHNE User-Check.
     * NUR für Admin-Operationen!
     * Lädt: Machine, MachineAttributes, AttributeValues,
     *       MachineTemplate, TemplateAttributes
     */
    @Query("SELECT DISTINCT m FROM Machine m " +
           "LEFT JOIN FETCH m.machineAttributes ma " +
           "LEFT JOIN FETCH ma.attributeValues " +
           "LEFT JOIN FETCH m.machineTemplate t " +
           "LEFT JOIN FETCH t.templateAttributes " +
           "WHERE m.id = :id")
    Optional<Machine> findWithAllDataById(@Param("id") Integer id);
}
