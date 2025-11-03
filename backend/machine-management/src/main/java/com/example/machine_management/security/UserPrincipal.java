package com.example.machine_management.security;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * UserPrincipal - Custom Authentication Object
 *
 * Speichert User-Informationen im SecurityContext.
 * Wird vom JwtAuthenticationFilter erstellt und gesetzt.
 *
 * Enthält:
 * - userId: Für Audit-Logging (createdBy, modifiedBy)
 * - email: Für User-Identifikation
 *
 * Ersetzt den simplen String email im SecurityContext,
 * damit wir auch die userId verfügbar haben.
 */
@Data
@AllArgsConstructor
public class UserPrincipal {
    private Integer userId;
    private String email;
}
