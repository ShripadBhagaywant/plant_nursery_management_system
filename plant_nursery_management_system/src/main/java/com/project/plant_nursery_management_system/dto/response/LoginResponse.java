package com.project.plant_nursery_management_system.dto.response;

public class LoginResponse {

    private String jwtToken;

    private String refreshToken;

    public LoginResponse(String jwtToken, String refreshToken) {
        this.jwtToken = jwtToken;
        this.refreshToken = refreshToken;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}
