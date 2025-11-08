package com.example.machine_management.services;

import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.dto.Machine.Attributes.CreateMachineAttributeDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.util.SecurityUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MachineAttributeService extends GenericCrudService<MachineAttribute, Integer, MachineAttributeDto> {

    private final MachineRepository machineRepository;
    private final MachineAttributeRepository attributeRepository;

    @Autowired
    public MachineAttributeService(
            MachineAttributeRepository attributeRepository,
            MachineAttributeMapper mapper,
            MachineRepository machineRepository) {
        super(attributeRepository, mapper);
        this.attributeRepository = attributeRepository;
        this.machineRepository = machineRepository;
    }

    public MachineAttribute createMachineAttribute(Integer machineId, CreateMachineAttributeDto dto) {
        Integer userId = SecurityUtils.getCurrentUserId();
        // Verify machine ownership
        Machine machine = machineRepository.findByIdAndUserId(machineId, userId)
                .orElseThrow(() -> new NotFoundException("Maschine mit ID " + machineId + " nicht gefunden."));

        // Create new attribute
        MachineAttribute attr = new MachineAttribute(machine.getId(), dto.attributeName,
                AttributeType.valueOf(dto.attributeType));
        attr.setUserId(userId);

        // Save and return
        MachineAttribute saved = attributeRepository.save(attr);
        return saved;
    }

    // ============= Implementierung der abstrakten Methoden aus GenericCrudService
    // =============

    @Override
    protected MachineAttribute updateEntity(MachineAttribute existingEntity, MachineAttributeDto dto) {
        existingEntity.setAttributeName(dto.attributeName);
        existingEntity.setType(AttributeType.valueOf(dto.attributeType));
        existingEntity.setPruefungsIntervall(dto.pruefungsIntervall);
        return existingEntity;
    }

    @Override
    protected List<MachineAttribute> findAllByUserId(Integer userId) {
        return attributeRepository.findByUserId(userId);
    }

    @Override
    protected Optional<MachineAttribute> findByIdAndUserId(Integer id, Integer userId) {
        return attributeRepository.findByIdAndUserId(id, userId);
    }

    @Override
    protected void setUserId(MachineAttribute entity, Integer userId) {
        entity.setUserId(userId);
    }

    public List<MachineAttribute> findByMachineId(Integer machineId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return attributeRepository.findByMachineIdAndUserId(machineId, userId);
    }

}