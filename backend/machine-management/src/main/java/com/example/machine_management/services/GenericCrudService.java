package com.example.machine_management.services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.util.SecurityUtils;

import java.util.List;
import java.util.Optional;

/**
 * Generischer Base-Service für CRUD-Operationen mit User-Filtering.
 * Arbeitet direkt mit Entities, Mapping zu DTOs erfolgt in Controller-Schicht.
 *
 * @param <E>   Entity type
 * @param <ID>  ID type
 * @param <DTO> DTO type für Input-Validierung und Mapping
 */
public abstract class GenericCrudService<E, ID, DTO> {
    protected final JpaRepository<E, ID> repo;
    protected final EntityMapper<E, DTO> mapper;

    protected GenericCrudService(JpaRepository<E, ID> repo, EntityMapper<E, DTO> mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    /**
     * Gibt das Repository zurück.
     */
    protected JpaRepository<E, ID> getRepository() {
        return repo;
    }

    /**
     * Findet alle Entities des eingeloggten Users.
     */
    public List<E> findAll() {
        Integer userId = SecurityUtils.getCurrentUserId();
        return findAllByUserId(userId);
    }

    /**
     * Findet Entity by ID und prüft Ownership.
     * 
     * @throws NotFoundException wenn Entity nicht gefunden oder User nicht Owner
     */
    public E findById(ID id) {
        Integer userId = SecurityUtils.getCurrentUserId();
        return findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Entity mit ID %s nicht gefunden oder kein Zugriff.", id)));
    }

    /**
     * Erstellt neue Entity aus DTO und setzt userId.
     */
    @Transactional
    public E create(DTO dto) {
        Integer userId = SecurityUtils.getCurrentUserId();
        E entity = mapper.fromDto(dto);
        setUserId(entity, userId);
        return repo.save(entity);
    }

    /**
     * Updated existierende Entity mit DTO-Daten.
     * Ownership-Check passiert in findById().
     */
    @Transactional
    public E update(ID id, DTO dto) {
        E existingEntity = findById(id); // Prüft Ownership!
        E updatedEntity = updateEntity(existingEntity, dto);
        return repo.save(updatedEntity);
    }

    /**
     * Abstrakte Update-Methode die von konkreten Services implementiert werden
     * muss.
     */
    protected abstract E updateEntity(E existingEntity, DTO dto);

    /**
     * Löscht Entity by ID nach Ownership-Check.
     */
    @Transactional
    public void delete(ID id) {
        E entity = findById(id); // Prüft Ownership!
        repo.delete(entity);
    }

    /**
     * Helper für Subklassen zum Laden einer Entity mit NotFoundException.
     */
    protected E getEntityById(ID id) {
        return findById(id);
    }

    // ============= Abstrakte Methoden die Subklassen implementieren müssen
    // =============

    /**
     * Findet alle Entities eines Users.
     * Muss von Subklasse implementiert werden.
     */
    protected abstract List<E> findAllByUserId(Integer userId);

    /**
     * Findet Entity by ID UND userId (Ownership-Check).
     * Muss von Subklasse implementiert werden.
     */
    protected abstract Optional<E> findByIdAndUserId(ID id, Integer userId);

    /**
     * Setzt die userId auf einer Entity.
     * Muss von Subklasse implementiert werden.
     */
    protected abstract void setUserId(E entity, Integer userId);
}