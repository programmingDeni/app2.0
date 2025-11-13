package com.example.machine_management.services.abstracts;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.util.SecurityUtils;

/**
 * Schema fuer CRUD Service
 * erbt von FindService such methoden 
 * bietet crud an  
 */
public abstract class CrudService<E extends UserOwned, ID, DTO> extends FindService<E, ID, DTO> {
    protected final JpaRepository<E, ID> repo;
    protected final EntityMapper<E, DTO> mapper;

    public CrudService(JpaRepository<E, ID> repo, EntityMapper<E, DTO> mapper) {
        super(repo);
        this.repo = repo;
        this.mapper = mapper;
    }

    /**
     * Gibt das Repository zurück.
     */
    protected JpaRepository<E, ID> getRepository() {
        return repo;
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  USER-FILTERED METHODS (Ownership-based Security)
    // ═══════════════════════════════════════════════════════════════════════

    
    /**
     * Erstellt neue Entity aus DTO und setzt userId.
     */
    @Transactional
    public E create(DTO dto) {
        Integer userId = SecurityUtils.getCurrentUserId();
        E entity = createEntity(dto);
        entity.setUserId(userId);
        return repo.save(entity);
    }

    /**
     * Finde alle Entities eines Users 
     */    
    public List<E> getAllUserEntities(boolean eager){
        Integer userId = SecurityUtils.getCurrentUserId();
        return eager 
            ? eagerGetAllUserEntities(userId)
            : lazyGetAllUserEntities(userId);
    }

    /**
     * Updated existierende Entity mit DTO-Daten.
     * Ownership-Check passiert in findById().
     */
    @Transactional
    public E update(ID id, DTO dto) {
        E existingEntity = userFindById(id, false); // Prüft Ownership!
        E updatedEntity = updateEntity(existingEntity, dto);
        return repo.save(updatedEntity);
    }

    /**
     * Löscht Entity by ID nach Ownership-Check.
     */
    @Transactional
    public void delete(ID id) {
        E entity = userFindById(id,false); // Prüft Ownership!
        repo.delete(entity);
    }
    
    // Entity manipulation
    protected abstract E createEntity(DTO dto);
    protected abstract List<E> eagerGetAllUserEntities(Integer userId);
    protected abstract List<E> lazyGetAllUserEntities(Integer userId);

    protected abstract E updateEntity(E existingEntity, DTO dto);
}