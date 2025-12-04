package com.example.machine_management.mapper;

import java.util.List;

public interface EntityMapper<E, DTO> {
    E fromDto(DTO dto);
    DTO toDto(E entity);
    List<DTO> toDtoList(List<E> entities);
}