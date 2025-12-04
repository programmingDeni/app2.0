package com.example.machine_management.controller;

import com.example.machine_management.dto.*;
import com.example.machine_management.dto.Auth.AuthRequest;
import com.example.machine_management.dto.Auth.AuthResponse;
import com.example.machine_management.dto.Auth.RefreshTokenRequest;
import com.example.machine_management.models.user.User;
import com.example.machine_management.security.UserPrincipal;
import com.example.machine_management.services.AuthService;
import com.example.machine_management.services.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    /**
     * POST /api/auth/register
     * Body: { email, password, firstName, lastName }
     * Response: { accessToken, refreshToken, userId, email, ... }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.register(
                    request.getEmail(),
                    request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Response: { accessToken, refreshToken, userId, email, ... }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(
                    request.getEmail(),
                    request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    /**
     * POST /api/auth/refresh
     * Body: { refreshToken }
     * Response: { accessToken }
     */
    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            String newAccessToken = authService.refresh(request.getRefreshToken());
            return ResponseEntity.ok(newAccessToken);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        try {
            // 1. UserPrincipal aus SecurityContext holen (wurde vom JwtAuthenticationFilter
            // gesetzt)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            // 2. Principal holen und zu UserPrincipal casten
            Object principal = authentication.getPrincipal();

            if (!(principal instanceof UserPrincipal)) {
                // Fallback: Falls noch kein UserPrincipal
                return ResponseEntity.status(401).build();
            }

            UserPrincipal userPrincipal = (UserPrincipal) principal;

            // 3. User aus DB holen
            User user = userService.findByEmail(userPrincipal.getEmail());

            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            // 3. User-Info zurückgeben (OHNE neue Tokens zu generieren)
            return ResponseEntity.ok(new AuthResponse(
                    null, // kein neuer accessToken
                    null, // kein neuer refreshToken
                    user.getId(),
                    user.getEmail()));

        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}