package com.example.machine_management.services.machine;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.dto.MachineAttributes.CreateMachineAttributeDto;
//dtos
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;
//Exception
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
import com.example.machine_management.repository.MachineAttributeRepository;
//repo
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.util.SecurityUtils;

@Service
public class MachineAttributeOperationsService extends ParentManagementService<MachineAttribute, Integer, MachineAttributeDto, CreateMachineAttributeDto, Machine, Integer> {

    private final MachineService machineService;

    private final MachineAttributeRepository machineAttributeRepo;

    @Autowired
    public MachineAttributeOperationsService(
            MachineAttributeRepository machineAttributeRepo,
            MachineService machineService) {
                super(machineAttributeRepo);
        this.machineAttributeRepo = machineAttributeRepo;
        this.machineService=machineService;
    }

    @Override
    protected MachineAttribute updateEntity(MachineAttribute existingEntity, MachineAttributeDto updateDto) {
        //TODO: hier muss noch was passieren
        if (updateDto.attributeName != null) {
            existingEntity.setAttributeName(updateDto.attributeName);
        }

        if (updateDto.attributeType != null) {
            existingEntity.setAttributeType((updateDto.attributeType));
        }
        if(updateDto.pruefungsIntervall != null){
            existingEntity.setPruefungsIntervall(updateDto.pruefungsIntervall);
        } 
        return existingEntity;
    }

    @Override
    protected Machine eagerFindParentById(Integer parentID) {
       return machineService.userFindById(parentID, true);
    }

    @Override
    protected Machine lazyFindParentById(Integer parentId) {
        return machineService.userFindById(parentId, false);
    }

    @Override
    protected List<MachineAttribute> eagerFindEntitiesByParentId(Integer parentId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return machineAttributeRepo.eagerFindByMachineIdAndUserId(parentId,userId );
    }

    @Override
    protected List<MachineAttribute> lazyFindEntitiesByParentId(Integer parentId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return machineAttributeRepo.lazyFindByMachineIdAndUserId(parentId, userId);
    }

    @Override
    public void removeEntityFromParent(Integer parentId, MachineAttribute entity) {
        Machine machine = this.findParentById(parentId, false);
        machine.removeAttribute(entity);
    }

    @Override
    protected MachineAttribute createEntity(CreateMachineAttributeDto dto, Machine parent) {
        Integer userId = SecurityUtils.getCurrentUserId();
        MachineAttribute entity = new MachineAttribute(
            userId,
            dto.attributeName,
            dto.attributeType,
            null,
            parent,
            false,
            365
        );
        return entity;
    }

    @Override
    protected void addEntityToParent(Machine parent, MachineAttribute entity) {
        parent.addAttribute(entity);
    }

    @Override
    protected Optional<MachineAttribute> userFindByIdLazy(Integer id, Integer userId) {
        return machineAttributeRepo.lazyFindByIdAndUserId(id, userId);
    }

    @Override
    protected Optional<MachineAttribute> userFindByIdEager(Integer id, Integer userId) {
        return machineAttributeRepo.eagerFindByIdAndUserId(id, userId);
    }

    @Override
    protected Optional<MachineAttribute> adminFindByIdEager(Integer id) {
        throw new UnsupportedOperationException("Unimplemented method 'adminFindByIdEager'");
    }

    @Override
    protected List<MachineAttribute> adminFindAllEager() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'adminFindAllEager'");
    }
}
