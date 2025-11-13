package com.example.machine_management.services;

import org.springframework.stereotype.Service;

import com.example.machine_management.dto.Auth.AuthResponse;
import com.example.machine_management.models.user.User;
import com.example.machine_management.security.JwtUtils;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthService(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Login - Erstellt ein Token und gibt dieses zurück
     */
    public AuthResponse login(String email, String password) {
        // User suchen
        User user = userService.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        // Passwort prüfen
        if (!userService.checkPassword(user, password)) {
            throw new RuntimeException("Invalid credentials");
        }

        // Token erstellen
        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getId());

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail());

    }

    /**
     * Register - Erstellt user und returned token
     */
    public AuthResponse register(String email, String password) {
        // User erstellen, checks im service
        User user = userService.createUser(email, password);

        // Einloggen und Token erstellen
        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getId());

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail());
    }

    public String refresh(String refreshToken) {
        // 1. Refresh Token validieren
        if (!jwtUtils.validateToken(refreshToken) || !jwtUtils.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // 2. User-Info aus Token holen
        String email = jwtUtils.getEmailFromToken(refreshToken);
        Integer userId = jwtUtils.getUserIdFromToken(refreshToken);

        // 3. Neuen Access Token generieren
        return jwtUtils.generateToken(email, userId);
    }
}
