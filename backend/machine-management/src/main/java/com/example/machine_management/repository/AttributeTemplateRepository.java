package com.example.machine_management.repository;

import com.example.machine_management.models.TemplateAttribute;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttributeTemplateRepository extends JpaRepository<TemplateAttribute, Integer> {

    // ============= User-filtered queries =============

    List<TemplateAttribute> findByUserId(Integer userId);

    Optional<TemplateAttribute> findByIdAndUserId(Integer id, Integer userId);

    void deleteAllByMachineTemplateId(Integer templateId);

    List<TemplateAttribute> findAllByMachineTemplateIdAndUserId(Integer machineTemplateId, Integer userId);

    List<TemplateAttribute> findAllByMachineTemplateId(Integer machineTemplateId);

    // ============= Legacy queries =============
    /*
     * 
     * void deleteAllByMachineTemplateId(Integer templateId);// lösche alle attribut
     * templates eines bestimmten machine id
     * // templates
     * 
     * List<TemplateAttribute> findAllByMachineTemplateId(Integer templateId); //
     * finde alle attribut templates eines
     * // bestimmten machine id templates
     */
}