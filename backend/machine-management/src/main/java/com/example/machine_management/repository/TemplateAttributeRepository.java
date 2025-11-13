package com.example.machine_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.machine_management.models.template.TemplateAttribute;

import java.util.List;
import java.util.Optional;

public interface TemplateAttributeRepository extends JpaRepository<TemplateAttribute, Integer> {

    // ============= User-filtered queries =============


    List<TemplateAttribute> findByUserId(Integer userId);

    Optional<TemplateAttribute> findByIdAndUserId(Integer id, Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM TemplateAttribute ta WHERE ta.machineTemplate.id = :templateId")
    void deleteAllByMachineTemplateId(@Param("templateId") Integer templateId);

    @Query("SELECT ta from TemplateAttribute ta WHERE ta.machineTemplate.id = :machineTemplateId AND ta.userId = :userId")
    List<TemplateAttribute> findAllByMachineTemplateIdAndUserId(Integer machineTemplateId, Integer userId);

    @Query("SELECT ta from TemplateAttribute ta WHERE ta.machineTemplate.id = :machineTemplateId")
    List<TemplateAttribute> findAllByMachineTemplateId(Integer machineTemplateId);

}