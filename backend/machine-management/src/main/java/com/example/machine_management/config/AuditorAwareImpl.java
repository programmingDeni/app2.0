package com.example.machine_management.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.machine_management.security.UserPrincipal;

import java.util.Optional;

/**
 * AuditorAware Implementation
 *
 * Spring Data JPA ruft diese Klasse automatisch auf,
 * um den aktuellen User (Auditor) zu ermitteln.
 *
 * Wird verwendet fuer:
 * - @CreatedBy: Setzt createdBy beim Erstellen
 * - @LastModifiedBy: Setzt modifiedBy beim Updaten
 *
 * Funktionsweise:
 * 1. Holt Authentication aus SecurityContext
 * 2. Extrahiert UserPrincipal (wurde vom JwtAuthenticationFilter gesetzt)
 * 3. Gibt userId zurueck
 * 4. Spring Data JPA setzt automatisch createdBy/modifiedBy
 */
@Component
@EnableJpaAuditing  // Aktiviert automatisches Auditing (createdBy, modifiedBy, etc.)
public class AuditorAwareImpl implements AuditorAware<Integer> {

    @Override
    public Optional<Integer> getCurrentAuditor() {
        // 1. Authentication aus SecurityContext holen
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Pruefen ob authenticated
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            // Kein User eingeloggt (z.B. bei /auth/login Endpoint)
            return Optional.empty();
        }

        // 3. Principal holen
        Object principal = authentication.getPrincipal();

        // 4. Pruefen ob es ein UserPrincipal ist
        if (principal instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) principal;
            // 5. User-ID zurueckgeben
            return Optional.of(userPrincipal.getUserId());
        }

        // Fallback: Kein UserPrincipal gefunden
        return Optional.empty();
    }
}