package com.example.machine_management.dto.Auth;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private Integer userId;
    private String email;

    public AuthResponse(String accessToken, String refreshToken,
            Integer userId, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.email = email;
    }

    // Getter (alle)
    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

}