
package com.example.machine_management.controller.base;

import com.example.machine_management.mapper.EntityMapper;
import com.example.machine_management.models.base.UserOwned;
import com.example.machine_management.services.abstracts.ParentManagementService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.function.Consumer;

/**
 * Abstract controller for nested resources under a parent.
 * Extends AbstractBaseController to leverage common CRUD helpers.
 *
 * Example: /api/machines/{machineId}/attributes
 *
 * Provides parent-aware CRUD operations where child entities belong to a parent.
 * Automatically validates parent-child relationships before operations.
 *
 * @param <E> Entity type (child)
 * @param <ID> ID type
 * @param <DTO> DTO type
 * @param <CreateDTO> CreateDTO type (without parent ID)
 * @Param <P> Parent Enitiy type
 * @param <PID> Parent ID type
 */
public abstract class AbstractNestedCrudController<
    E extends UserOwned,
    ID,
    DTO,
    CreateDTO,
    P,
    PID
> extends AbstractBaseController<E, ID, DTO> {

    /**
     * Returns the service handling CRUD operations for this nested entity.
     * Must override to provide ParentManagementService implementation.
     */
    @Override
    protected abstract ParentManagementService<E, ID, DTO, CreateDTO, P, PID> getService();

    /**
     * Returns the mapper for converting between entity and DTO.
     * Must override to provide EntityMapper implementation.
     */
    @Override
    protected abstract EntityMapper<E, DTO> getMapper();

    protected abstract P getParent(PID parentId);

    /**
     * Validate that entity belongs to the specified parent.
     * Called automatically before READ, UPDATE, and DELETE operations.
     *
     * @param entity the child entity
     * @param parentId the parent ID from the URL
     * @return true if entity belongs to parent, false otherwise
     */
    protected abstract boolean belongsToParent(E entity, PID parentId);

    /**
     * Converts CreateDTO + parentId to full DTO for creation.
     * Override this to enrich the DTO with parent information.
     *
     * @param createDto the create DTO from request body
     * @param parentId the parent ID from URL path
     * @return enriched DTO ready for service.create()
     */
    protected abstract DTO enrichDtoWithParentId(CreateDTO createDto, PID parentId);

    // ========== CRUD OPERATIONS ==========

    /**
     * CREATE - Creates a new nested entity
     * POST /
     */
    @Operation(summary = "Create nested entity")
    @PostMapping
    public ResponseEntity<DTO> create(
            @PathVariable PID parentId,
            @RequestBody CreateDTO createDto) {
        if(createDto == null){
            throw new IllegalArgumentException("DTO darf nicht null sein.");
        }
        E created = getService().addToParent(parentId, createDto);
        return performCreate(created);
    }

    /**
     * READ ALL - Get all entities by parent ID
     * GET / with optional ?eager=true parameter
     */
    @Operation(summary = "Get all nested entities by parent ID")
    @GetMapping
    public ResponseEntity<List<DTO>> findAllByParentId(
            @PathVariable PID parentId,
            @RequestParam(required = false, defaultValue = "false") Boolean eager) {

        List<E> entities = getService().findEntitiesByParentId(parentId, eager);
        return ResponseEntity.ok(getMapper().toDtoList(entities));
    }

    /**
     * Fetch children by parent ID.
     * Override this to implement parent-specific query.
     *
     * @param parentId the parent ID
     * @param eager whether to fetch eagerly (with relationships)
     * @return list of child entities
     */
    protected abstract List<E> findByParentId(PID parentId, boolean eager);

    /**
     * READ ONE - Get entity by ID (eager loading with relationships)
     * GET /{id}
     */
    @Operation(summary = "Get nested entity by ID (eager)")
    @GetMapping("/{id}")
    public ResponseEntity<DTO> findById(
            @PathVariable PID parentId,
            @PathVariable ID id) {

        return performRead(id, true,validateParentRelationship(parentId));
    }

    /**
     * READ ONE - Get entity by ID (lazy loading without relationships)
     * GET /{id}/lazy
     */
    @Operation(summary = "Get nested entity by ID (lazy)")
    @GetMapping("/{id}/lazy")
    public ResponseEntity<DTO> findByIdLazy(
            @PathVariable PID parentId,
            @PathVariable ID id) {

        return performRead(id, false, validateParentRelationship(parentId));
    }

    /**
     * UPDATE - Updates an existing nested entity
     * PUT /{id}
     */
    @Operation(summary = "Update nested entity")
    @PutMapping("/{id}")
    public ResponseEntity<DTO> update(
            @PathVariable PID parentId,
            @PathVariable ID id,
            @RequestBody DTO dto) {

        return performUpdate(id, dto,
           validateParentRelationship(parentId),
            entity -> getService().update(id, dto)
        );
    }

    /**
     * DELETE - Deletes a nested entity
     * DELETE /{id}
     */
    @Operation(summary = "Delete nested entity")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable PID parentId,
            @PathVariable ID id) {
        return performDelete(id,
            validateParentRelationship(parentId),
            entity -> {
                getService().removeFromParent(parentId,entity);
            }
        );
    }

    /**
     * Creates a validation lambda that checks if entity belongs to parent.
     * @param parentId the parent ID to validate against
     * @return Consumer that validates parent-child relationship
     */
    private Consumer<E> validateParentRelationship(PID parentId) {
        return entity -> {
            if (!belongsToParent(entity, parentId)) {
                throw new IllegalArgumentException(
                    "Entity does not belong to parent with ID: " + parentId
                );
            }
        };
    }

}