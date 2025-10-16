package com.example.machine_management.services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
// not found exception import 
import com.example.machine_management.exceptions.NotFoundException;
// mapper import 
import com.example.machine_management.mapper.EntityMapper;

import java.util.List;

/**
 * Generischer Base-Service für CRUD-Operationen.
 * Arbeitet direkt mit Entities, Mapping zu DTOs erfolgt in Controller-Schicht.
 *
 * @param <E> Entity type
 * @param <ID> ID type
 * @param <DTO> DTO type für Input-Validierung und Mapping
 * 
 * @see #findAll() Lädt alle Entities (ohne Lazy-Loading)
 * @see #findById(ID) Lädt Entity by ID (ohne Lazy-Loading)
 * @see #create(DTO) Erstellt neue Entity aus DTO
 * @see #update(ID, DTO) Updated existierende Entity
 * @see #delete(ID) Löscht Entity by ID
 * 
 * Wichtig für Implementierende Klassen:
 * - Überschreibe findAll() wenn du eager loading brauchst
 * - Überschreibe findById() für spezifische Fetch-Strategien
 * - Validierung der DTOs erfolgt im EntityMapper
 * 
 * @throws NotFoundException wenn Entity nicht gefunden
 * @throws IllegalArgumentException bei invaliden DTO-Daten (über EntityMapper)
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
     * Nützlich für Subklassen, die spezifische Methoden des Repositories brauchen.
     * @return
     */
    protected JpaRepository<E, ID> getRepository() {
        return repo;
    }

    /**
     * Findet alle Entities. Achtung: Lazy-Loading-Beziehungen sind nicht initialisiert.
     * Überschreibe diese Methode wenn du spezifische Relations laden musst.
     */
    public List<E> findAll() {
        return repo.findAll();
    }

    /**
     * Findet Entity by ID. Achtung: Lazy-Loading-Beziehungen sind nicht initialisiert.
     * Überschreibe diese Methode wenn du spezifische Relations laden musst.
     *
     * @throws NotFoundException wenn Entity nicht gefunden
     */
    public E findById(ID id) {
        return repo.findById(id)
                   .orElseThrow(() -> new NotFoundException(
                       String.format("Entity mit ID %s nicht gefunden.", id)));
    }

    /**
     * Erstellt neue Entity aus DTO.
     * Validierung erfolgt im EntityMapper.
     */
    @Transactional
    public E create(DTO dto) {
        E entity = mapper.fromDto(dto);
        return repo.save(entity);
    }

    /**
     * Updated existierende Entity mit DTO-Daten.
     * Validierung erfolgt im EntityMapper.
     *
     * @throws NotFoundException wenn Entity nicht gefunden
     */
@Transactional
public E update(ID id, DTO dto) {
    E existingEntity = findById(id);
    // Hier kommt die eigentliche Update-Logik
    E updatedEntity = updateEntity(existingEntity, dto);
    return repo.save(updatedEntity);
}

    /**
     * Abstrakte Update-Methode die von konkreten Services implementiert werden muss.
     * Hier erfolgt die eigentliche Update-Logik.
     *
     * @param existingEntity Die zu aktualisierende Entity
     * @param dto DTO mit den neuen Daten
     */
    protected abstract E updateEntity(E existingEntity, DTO dto);

    /**
     * Löscht Entity by ID.
     *
     * @throws NotFoundException wenn Entity nicht gefunden
     */
    @Transactional
    public void delete(ID id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException(
                String.format("Entity mit ID %s nicht gefunden.", id));
        }
        repo.deleteById(id);
    }

    /**
     * Helper für Subklassen zum Laden einer Entity mit NotFoundException.
     * Verwendet repo.findById - überschreibe diese Methode wenn du
     * spezifische Relations laden musst.
     */
    protected E getEntityById(ID id) {
        return findById(id);
    }
}