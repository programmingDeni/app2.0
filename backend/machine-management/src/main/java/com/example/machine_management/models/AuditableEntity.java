package com.example.machine_management.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;

@MappedSuperclass
@Getter
public abstract class AuditableEntity {
    @Column(name = "created_by", nullable = false, updatable = false)
    private Integer createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "modified_by")
    private Integer modifiedBy;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Set createdBy from SecurityContext
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
        // Set modifiedBy from SecurityContext
    }

    public void setModifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}