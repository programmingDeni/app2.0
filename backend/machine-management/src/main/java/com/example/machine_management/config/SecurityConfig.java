package com.example.machine_management.config;

import com.example.machine_management.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF deaktivieren (nicht nötig bei JWT/Stateless)
                .csrf(csrf -> csrf.disable())

                // 2. CORS konfigurieren (nutzt deine WebConfig)
                // Cors erlauben alle CORS-Anfragen
                .cors(Customizer.withDefaults())

                // 3. Authorization Rules - WER darf WAS?
                .authorizeHttpRequests(auth -> auth
                        // Öffentliche Endpoints (ohne Token zugänglich)
                        .requestMatchers("/api/auth/**").permitAll() // Login, Register, etc.
                        .requestMatchers("/error").permitAll() // Spring Error Page

                        // Alle anderen Endpoints benötigen Authentication
                        .anyRequest().authenticated())

                // 4. Session Management - STATELESS (kein Session Cookie)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. JWT Filter BEFORE UsernamePasswordAuthenticationFilter einfügen
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}