package com.example.machine_management.repository;

import com.example.machine_management.models.AttributeInTemplate;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttributeTemplateRepository extends JpaRepository<AttributeInTemplate, Integer> {

    void deleteAllByMachineTemplateId(Integer templateId);// lösche alle attribut templates eines bestimmten machine id templates

    List<AttributeInTemplate> findAllByMachineTemplateId(Integer templateId); // finde alle attribut templates eines bestimmten machine id templates
} 