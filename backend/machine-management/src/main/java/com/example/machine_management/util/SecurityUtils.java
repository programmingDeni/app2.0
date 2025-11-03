package com.example.machine_management.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.machine_management.security.UserPrincipal;

/**
 * Utility-Klasse für Security-bezogene Operationen.
 * Stellt Helper-Methoden bereit um auf den aktuell authentifizierten User zuzugreifen.
 */
public class SecurityUtils {

    /**
     * Holt die userId des aktuell eingeloggten Users aus dem SecurityContext.
     *
     * Diese Methode:
     * 1. Holt die Authentication aus dem SecurityContextHolder
     * 2. Prüft ob der User authentifiziert ist
     * 3. Castet das Principal zu UserPrincipal
     * 4. Gibt die userId zurück
     *
     * @return userId des eingeloggten Users
     * @throws RuntimeException wenn User nicht authentifiziert ist oder Principal kein UserPrincipal ist
     */
    public static Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User ist nicht authentifiziert");
        }

        // Check if principal is anonymousUser (not logged in)
        if (authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User ist nicht authentifiziert (anonymous)");
        }

        // Cast to UserPrincipal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            throw new RuntimeException("Principal ist kein UserPrincipal: " + principal.getClass().getName());
        }

        UserPrincipal userPrincipal = (UserPrincipal) principal;
        return userPrincipal.getUserId();
    }

    /**
     * Optional: Holt das komplette UserPrincipal-Objekt.
     * Nützlich wenn du auch die Email brauchst.
     *
     * @return UserPrincipal des eingeloggten Users
     * @throws RuntimeException wenn User nicht authentifiziert ist
     */
    public static UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User ist nicht authentifiziert");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            throw new RuntimeException("Principal ist kein UserPrincipal");
        }

        return (UserPrincipal) principal;
    }
}
