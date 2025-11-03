package com.example.machine_management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    public JwtAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // 1. Token aus Header holen
            String token = getTokenFromRequest(request);

            // 2. Token validieren
            if (token != null && jwtUtils.validateToken(token)) {

                // 3. User-Info aus Token extrahieren
                String email = jwtUtils.getEmailFromToken(token);
                Integer userId = jwtUtils.getUserIdFromToken(token);

                // 3.1. userprincipal aus user info (email und password) erstellen
                UserPrincipal userPrincipal = new UserPrincipal(userId, email);

                // 4. Authentication Object erstellen
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userPrincipal, // Principal (User-Identität)
                        null, // Credentials (nicht nötig bei JWT)
                        new ArrayList<>() // Authorities (Rollen, später)
                );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // 5. User im SecurityContext speichern
                // Ab jetzt ist der User "eingeloggt" für diesen Request
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            // Token parsing fehlgeschlagen -> User bleibt unauthenticated
            logger.error("Cannot set user authentication: {}", e);
        }

        // 6. Weiter zum nächsten Filter/Controller
        filterChain.doFilter(request, response);
    }

    // Helper: Token aus "Authorization: Bearer <token>" Header extrahieren
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " entfernen
        }

        return null;
    }
}