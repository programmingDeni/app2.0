package com.example.machine_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.example.machine_management.models.MachineTemplate;

public interface MachineTemplateRepository extends JpaRepository<MachineTemplate, Integer> {

    @Query("SELECT t FROM MachineTemplate t LEFT JOIN FETCH t.attributes WHERE t.id = :id")
    Optional<MachineTemplate> findByIdWithAttributes(@Param("id") Integer id);

} 