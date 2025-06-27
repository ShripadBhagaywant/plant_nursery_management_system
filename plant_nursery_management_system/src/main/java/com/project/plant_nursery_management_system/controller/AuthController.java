package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.request.LoginRequest;
import com.project.plant_nursery_management_system.dto.response.LoginResponse;
import com.project.plant_nursery_management_system.dto.request.RegisterUserRequest;
import com.project.plant_nursery_management_system.security.JwtUtil;
import com.project.plant_nursery_management_system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    private final JwtUtil jwtUtil;

    public AuthController(AuthService service , JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserRequest req) {
        service.register(req);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(service.login(req));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token is missing");
        }

        try {
            String username = jwtUtil.extractUsername(refreshToken);

            // Check if token is expired
            if (jwtUtil.validateToken(refreshToken, username)) {
                String newAccessToken = jwtUtil.generateRefreshToken(username);
                return ResponseEntity.ok(new LoginResponse(newAccessToken, refreshToken));
            } else {
                return ResponseEntity.status(401).body("Refresh token expired");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }

}
