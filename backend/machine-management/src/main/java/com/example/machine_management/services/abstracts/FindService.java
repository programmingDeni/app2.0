package com.example.machine_management.services.abstracts;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.util.SecurityUtils;
//schema for nested entity services
//needs crud operations for nested entities
//therefore 3 methods to get the userId and 
//and 3 abstract methods then to implement crud
public abstract class FindService<E extends UserOwned, ID, DTO> {
    
    protected final JpaRepository<E, ID> repository;

    public FindService(JpaRepository<E, ID> repository) {
        this.repository = repository;
    }

    public E userFindById(ID id, boolean eager) {
        Integer userId = SecurityUtils.getCurrentUserId();
        Optional<E> entity = eager 
            ? userFindByIdEager(id, userId)
            : userFindByIdLazy(id, userId);
        return entity.orElseThrow(() -> new NotFoundException("Entity not found"));
    }

    public E adminFindById(ID id, boolean eager) {
        if (eager) {
            return adminFindByIdEager(id)
                .orElseThrow(() -> new RuntimeException("Entity not found"));
        } else {
            return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found"));
        }
    }


    public List<E> adminFindAll(boolean eager) {
        return eager ? adminFindAllEager() : repository.findAll();
    }

    // Abstract find methods
    protected abstract Optional<E> userFindByIdLazy(ID id, Integer userId);
    protected abstract Optional<E> userFindByIdEager(ID id, Integer userId);
    protected abstract Optional<E> adminFindByIdEager(ID id);
    protected abstract List<E> adminFindAllEager();
}