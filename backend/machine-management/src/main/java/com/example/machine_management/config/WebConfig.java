package com.example.machine_management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // alle Pfade
                .allowedOrigins("http://localhost:5173", // Vite-Port
                "http://localhost:3000" // Next-Port
                ) 
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
