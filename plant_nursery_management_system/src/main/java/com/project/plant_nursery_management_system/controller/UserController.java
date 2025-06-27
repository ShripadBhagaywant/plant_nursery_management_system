package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.request.OtpVerificationRequest;
import com.project.plant_nursery_management_system.dto.request.PasswordResetRequest;
import com.project.plant_nursery_management_system.dto.request.PasswordResetOtpRequest;
import com.project.plant_nursery_management_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<String> profile() {
        // Example protected endpoint
        return ResponseEntity.ok("Profile works!");
    }


    @PostMapping("/send-reset-otp")
    public ResponseEntity<String> sendResetOtp(@Valid  @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(userService.sendPasswordResetOtp(request.getEmail()));
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest request) {
        return ResponseEntity.ok(userService.verifyOtp(request.getEmail(), request.getOtp()));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetOtpRequest request) {
        return ResponseEntity.ok(
                userService.resetPassword(request.getEmail(), request.getNewPassword(), request.getConfirmPassword())
        );
    }

    @PostMapping("/resend-reset-otp")
    public ResponseEntity<String> resendResetOtp(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(userService.sendPasswordResetOtp(request.getEmail()));
    }


}
