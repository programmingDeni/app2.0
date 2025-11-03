package com.example.machine_management.repository;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineTemplate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Integer> {

        // ============= User-filtered queries =============

        /**
         * Findet alle Maschinen eines bestimmten Users.
         */
        List<Machine> findAllByUserId(Integer userId);

        /**
         * Findet eine Maschine by ID UND prüft Ownership (userId).
         * Sicherheitskritisch: Verhindert dass User A Maschine von User B sieht.
         */
        Optional<Machine> findByIdAndUserId(Integer id, Integer userId);

        /**
         * Findet Maschine mit allen Relations (eager loading) UND prüft Ownership.
         * Lädt: MachineAttributes, MachineTemplate
         */
        @EntityGraph(attributePaths = {
                        "machineAttributes",
                        "machineTemplate"
        })
        Optional<Machine> findWithAllDataByIdAndUserId(Integer id, Integer userId);

        List<Machine> findAllByMachineTemplateIdAndUserId(Integer templateId, Integer userId);

        // ============= Legacy queries =============
        /*
         * 
         * Optional<Machine> findByMachineName(String name);
         * 
         * // TODO: muss ich auch die values laden ?, muss ich auch die
         * TemplateAttributes
         * // laden?
         * 
         * @EntityGraph(attributePaths = {
         * "machineAttributes", // Machine → MachineAttributes
         * "machineTemplate" // Wenn Attribute selbst Werte haben
         * })
         * Optional<Machine> findWithAllDataById(Integer id);
         * 
         * List<Machine> findByMachineTemplate(MachineTemplate template);
         * 
         */
}
