package com.example.machine_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.machine_management.models.MachineTemplate;

public interface MachineTemplateRepository extends JpaRepository<MachineTemplate, Integer> {

    // ============= User-filtered queries =============

    List<MachineTemplate> findAllByUserId(Integer userId);

    Optional<MachineTemplate> findByIdAndUserId(Integer id, Integer userId);

    @Query("SELECT DISTINCT t FROM MachineTemplate t LEFT JOIN FETCH t.attributeTemplates WHERE t.userId = :userId")
    List<MachineTemplate> findAllWithAttributeTemplatesByUserId(@Param("userId") Integer userId);

    // AttributeTemplateRepository oder MachineTemplateRepository
    @Query("SELECT t FROM MachineTemplate t LEFT JOIN FETCH t.attributeTemplates WHERE t.id = :id AND t.userId = :userId")
    Optional<MachineTemplate> findByIdWithAttributesAndUserId(@Param("id") Integer id, @Param("userId") Integer userId);

    // ============= Legacy queries =============
    /*
     * @EntityGraph(attributePaths = "attributeTemplates")
     * 
     * @Query("SELECT t FROM MachineTemplate t")
     * List<MachineTemplate> findAllWithAttributeTemplates();
     * 
     * @Query("SELECT t FROM MachineTemplate t LEFT JOIN FETCH t.attributeTemplates WHERE t.id = :id"
     * )
     * Optional<MachineTemplate> findByIdWithAttributes(@Param("id") Integer id);
     */
}