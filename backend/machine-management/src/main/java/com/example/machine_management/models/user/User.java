package com.example.machine_management.models.user;

import org.springframework.data.annotation.CreatedBy;

import com.example.machine_management.models.base.AuditableEntity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "\"user\"")
@Getter
@AttributeOverride(name = "createdBy", column = @Column(name = "created_by", nullable = true, updatable = false))
public class User extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // hashing

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    // TODO: add organizationId

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
