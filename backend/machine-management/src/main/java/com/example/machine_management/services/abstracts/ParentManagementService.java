package com.example.machine_management.services.abstracts;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.util.SecurityUtils;

public abstract class ParentManagementService<E extends UserOwned, ID, DTO, CreateDTO, P, PID>
 extends FindService<E, ID, DTO> {

    public ParentManagementService(JpaRepository<E, ID> repository) {
        super(repository);
    }

    // ===== PARENT MANAGEMENT =====
    public E addToParent(PID parentId, CreateDTO dto) {
        Integer userId = SecurityUtils.getCurrentUserId();
        P parent = findParentById(parentId, false);
        E entity = createEntity(dto, parent);
        entity.setUserId(userId);
        addEntityToParent(parent, entity);
        return repository.save(entity);
    }

        /**
     * Update an existing entity. Ownership is verified before update.
     * 
     * @param id The entity ID
     * @param dto The DTO containing updated data
     * @return The updated entity
     */
    public E update(ID id, DTO dto) {
        E existingEntity = userFindById(id, false); // Ownership check
        E updatedEntity = updateEntity(existingEntity, dto);
        return repository.save(updatedEntity);
    }

    public void removeFromParent(PID parentId, E entity){
        removeEntityFromParent(parentId, entity);
        repository.delete(entity);
    }

    public P findParentById(PID parentId, boolean eager){
        return eager ? eagerFindParentById(parentId) : lazyFindParentById(parentId);
    }

    public List<E> findEntitiesByParentId(PID parentId, boolean eager){
        return eager ? eagerFindEntitiesByParentId(parentId) : lazyFindEntitiesByParentId(parentId);
    }

    //repository queues 
    protected abstract P eagerFindParentById(PID parentID);
    protected abstract P lazyFindParentById(PID parentId);
    protected abstract List<E> eagerFindEntitiesByParentId(PID parentId);
    protected abstract List<E> lazyFindEntitiesByParentId(PID parentId);
    

    protected abstract void removeEntityFromParent(PID parentId, E entity);
    protected abstract E createEntity(CreateDTO dto, P parent);
    protected abstract E updateEntity(E existingEntity, DTO updateDto );
    protected abstract void addEntityToParent(P parent, E entity);
    
}
