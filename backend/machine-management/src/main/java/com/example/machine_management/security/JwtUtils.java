package com.example.machine_management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Diese Klasse macht 3 Dinge:
 * Token erstellen (nach Login)
 * Token validieren (bei jedem Request)
 * User-Infos aus Token extrahieren
 */

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret; // Aus application.properties

    @Value("${jwt.expiration}")
    private long jwtExpiration; // z.B. 900000 ms = 15 Minuten

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // 1. TOKEN ERSTELLEN (nach erfolgreichem Login)
    public String generateToken(String email, Integer userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email) // Hauptidentität (Email)
                .claim("userId", userId) // Zusätzliche Info
                .issuedAt(now) // Erstellungszeit
                .expiration(expiry) // Ablaufzeit
                .signWith(getSigningKey()) // Signieren
                .compact(); // Als String
    }

    // 2. TOKEN VALIDIEREN (bei jedem Request)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            // Token ungültig, abgelaufen, oder manipuliert
            return false;
        }
    }

    // 3. EMAIL AUS TOKEN EXTRAHIEREN
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject(); // Email
    }

    // 4. USER-ID AUS TOKEN EXTRAHIEREN
    public Integer getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("userId", Integer.class);
    }

    public String generateRefreshToken(String email, Integer userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtRefreshExpiration);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("type", "refresh") // Markierung als Refresh Token
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public boolean isRefreshToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return "refresh".equals(claims.get("type"));
    }
}