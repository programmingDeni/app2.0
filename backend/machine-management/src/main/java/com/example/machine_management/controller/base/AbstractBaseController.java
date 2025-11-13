package com.example.machine_management.controller.base;

import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.services.abstracts.FindService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * Base controller providing common functionality for all CRUD controllers.
 * Contains shared validation logic and helper methods to eliminate code duplication.
 *
 * @param <E> Entity type extending UserOwned
 * @param <ID> ID type (e.g., Integer, Long)
 * @param <DTO> DTO type
 */
public abstract class AbstractBaseController<E extends UserOwned, ID, DTO> {

    /**
     * Returns the service handling operations for this entity.
     * Subclasses should return their specific service type.
     */
    protected abstract FindService<E, ID, DTO> getService();

    /**
     * Returns the mapper for converting between entity and DTO.
     */
    protected abstract EntityMapper<E, DTO> getMapper();

    // ========== VALIDATION METHODS ==========

    /**
     * Validates that the DTO is not null.
     * @param dto the DTO to validate
     * @throws IllegalArgumentException if DTO is null
     */
    protected void validateDto(DTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO darf nicht null sein.");
        }
    }

    /**
     * Validates that the ID is not null and positive (for Integer/Long types).
     * @param id the ID to validate
     * @throws IllegalArgumentException if ID is null or invalid
     */
    protected void validateId(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID darf nicht null sein.");
        }
        if (id instanceof Integer && (Integer) id <= 0) {
            throw new IllegalArgumentException("ID must be positive");
        }
        if (id instanceof Long && (Long) id <= 0L) {
            throw new IllegalArgumentException("ID must be positive");
        }
    }


    // ========== HELPER METHODS FOR CRUD OPERATIONS ==========

    /**
     * Helper method for CREATE operations.
     * Wraps the created entity in a 201 CREATED response with DTO.
     *
     * @param entity the created entity
     * @return ResponseEntity with status 201 and DTO body
     */
    protected ResponseEntity<DTO> performCreate(E entity) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(getMapper().toDto(entity));
    }

    /**
     * Helper method for READ operations.
     * Handles validation, entity fetching, and optional additional validation.
     *
     * @param id the entity ID
     * @param eager whether to fetch eagerly (with relationships)
     * @param additionalValidation optional additional validation logic
     * @return ResponseEntity with status 200 and DTO body
     */
    protected ResponseEntity<DTO> performRead(ID id, boolean eager,
                                               Consumer<E> additionalValidation) {
        validateId(id);
        E entity = getService().userFindById(id, eager);
        if(additionalValidation != null){
            additionalValidation.accept(entity);
        }
        return ResponseEntity.ok(getMapper().toDto(entity));
    }

    /**
     * Helper method for UPDATE operations.
     * Handles validation, update execution, and optional additional validation.
     *
     * @param id the entity ID
     * @param dto the updated DTO
     * @param additionalValidation optional additional validation logic
     * @param updater function to perform the update
     * @return ResponseEntity with status 200 and DTO body
     */
    protected ResponseEntity<DTO> performUpdate(ID id, DTO dto,
                                                 Consumer<E> additionalValidation,
                                                 Function<E, E> updater) {
        validateId(id);
        validateDto(dto);
        E entity = getService().userFindById(id, false);
        if(additionalValidation != null){
            additionalValidation.accept(entity);
        }
        if(updater == null){
            throw new IllegalArgumentException("Controller: Kein Updater uebergeben");
        }
        E updated = updater.apply(entity);
        return ResponseEntity.ok(getMapper().toDto(updated));
    }

    /**
     * Helper method for DELETE operations.
     * Handles validation, optional additional validation, and deletion.
     *
     * @param id the entity ID
     * @param additionalValidation optional additional validation logic
     * @param deleter consumer to perform the deletion
     * @return ResponseEntity with status 204 (No Content)
     */
    protected ResponseEntity<Void> performDelete(ID id,
                                                  Consumer<E> additionalValidation,
                                                  Consumer<E> deleter) {
        validateId(id);
        E entity = getService().userFindById(id, false);
        if(additionalValidation != null){
            additionalValidation.accept(entity);
        }
        if((deleter == null)){
            throw new IllegalArgumentException("Controller Error: No delete function passed");
        }
        deleter.accept(entity);
        return ResponseEntity.noContent().build();
    }
}
