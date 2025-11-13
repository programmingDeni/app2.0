package com.example.machine_management.services.machine;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.services.abstracts.CrudService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service für die Verwaltung von Maschinen (Machine Entities).
 * Erweitert den GenericCrudService für Standard-CRUD-Operationen und
 * delegiert spezialisierte Operationen an dedizierte Services.
 * CRUD Operations und user reads 
 */

@Service
public class MachineService extends CrudService<Machine, Integer, MachineDto> {

    //repo
    private final MachineRepository machineRepository;

    @Autowired
    public MachineService(
            MachineRepository machineRepository,
            MachineMapper mapper){
        super(machineRepository, mapper);
        this.machineRepository = machineRepository;
    }

    @Override
    protected Machine createEntity(MachineDto dto) {
        validateMachineDto(dto);
        //fuer create from template eigene methode
        return new Machine(dto.machineName);
    }

    @Override
    protected List<Machine> eagerGetAllUserEntities(Integer userId) {
        return machineRepository.findAllByUserIdEager(userId);
    }

    @Override
    protected List<Machine> lazyGetAllUserEntities(Integer userId) {
        return machineRepository.findAllByUserId(userId);
    }

    @Override
    protected Machine updateEntity(Machine existingEntity, MachineDto dto) {
        validateMachineDto(dto);
        existingEntity.setMachineName(dto.machineName);
        //modified by und at wird anscheindnd von jpa auditin uebernommen
        return existingEntity; // GenericCrudService speichert es
    }
    
    @Override
    protected Optional<Machine> userFindByIdLazy(Integer id, Integer userId) {
        return machineRepository.findByIdAndUserId(id, userId);
    }


    @Override
    protected Optional<Machine> userFindByIdEager(Integer id, Integer userId) {
        return machineRepository.findWithAllDataByIdAndUserId(id, userId);
    }

    @Override
    protected Optional<Machine> adminFindByIdEager(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'adminFindByIdEager'");
    }


    @Override
    protected List<Machine> adminFindAllEager() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'adminFindAllEager'");
    }

    private void validateMachineDto(MachineDto dto){
        if(dto.machineName == null || dto.machineName.trim().isEmpty()){
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }
    }


}