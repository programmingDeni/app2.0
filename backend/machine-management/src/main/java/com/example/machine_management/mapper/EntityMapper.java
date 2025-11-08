package com.example.machine_management.mapper;

public interface EntityMapper<E, DTO> {
    E fromDto(DTO dto);
    DTO toDto(E entity);
}