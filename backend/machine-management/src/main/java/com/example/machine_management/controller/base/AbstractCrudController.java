package com.example.machine_management.controller.base;

import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.services.abstracts.CrudService;

import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Abstract CRUD controller for standard (non-nested) resources.
 * Provides complete CRUD operations for entities accessible at flat URLs (e.g., /api/machines).
 *
 * Extends AbstractBaseController for CRUD helpers and validation.
 *
 * @param <E> Entity type (e.g., Machine, User, MachineTemplate)
 * @param <ID> ID type (e.g., Integer, Long)
 * @param <DTO> DTO type (e.g., MachineDto, UserDto)
 */
public abstract class AbstractCrudController<E extends UserOwned, ID, DTO>
        extends AbstractBaseController<E, ID, DTO> {

    /**
     * Returns the service handling CRUD operations for this entity.
     * Must override to provide CrudService implementation.
     */
    @Override
    protected abstract CrudService<E, ID, DTO> getService();

    /**
     * Returns the mapper for converting between entity and DTO.
     * Must override to provide EntityMapper implementation.
     */
    @Override
    protected abstract EntityMapper<E, DTO> getMapper();

    // ========== CRUD OPERATIONS ==========

    /**
     * CREATE - Creates a new entity
     * POST /
     */
    @Operation(summary = "Create entity")
    @PostMapping
    public ResponseEntity<DTO> create(@RequestBody DTO dto) {
        validateDto(dto);
        E created = getService().create(dto);
        return performCreate(created);
    }



    /**
     * Helper method for GET ALL operations.
     * wrapps the response in an responsentity and converts to dto
     * @return ResponseEntity<List<DTO>> with status 200 and List<DTO> body
     */
    @Operation(summary = "Get all entities")
    @GetMapping
    public ResponseEntity<List<DTO>> performGetAll( @RequestParam(required = false, defaultValue = "true") boolean eager){
        return ResponseEntity.ok(getMapper().toDtoList(getService().getAllUserEntities(eager)));
    }

    /**
     * READ - Get entity by ID (eager loading with relationships)
     * GET /{id}
     */
    @Operation(summary = "Eager get the entity by Id for a user")
    @GetMapping("/{id}")
    public ResponseEntity<DTO> userEagerGetById(@PathVariable ID id) {
        validateId(id);
        return performRead(id, true, null);
    }

    /**
     * READ - Get entity by ID (lazy loading without relationships)
     * GET /{id}/lazy
     */
    @Operation(summary = "Lazy get the entity by id for a user")
    @GetMapping("/{id}/lazy")
    public ResponseEntity<DTO> userLazyGetById(@PathVariable ID id) {
        validateId(id);
        return performRead(id, false, null);
    }

    /**
     * UPDATE - Updates an existing entity
     * PUT /{id}
     */
    @Operation(summary = "Update entity")
    @PutMapping("/{id}")
    public ResponseEntity<DTO> update(@PathVariable ID id, @RequestBody DTO dto) {
        return performUpdate(id, dto,
            null,
            entity -> getService().update(id, dto)
        );
    }

    /**
     * DELETE - Deletes an entity
     * DELETE /{id}
     */
    @Operation(summary = "Delete entity")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        return performDelete(id,
            null,
            entity -> getService().delete(id)
        );
    }
}