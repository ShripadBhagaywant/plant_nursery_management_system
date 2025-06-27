package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.AdminDashboardSummaryDto;
import com.project.plant_nursery_management_system.dto.response.UserResponse;
import com.project.plant_nursery_management_system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final UserService userService;
    public AdminController(UserService userService) { this.userService = userService; }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> allUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @PutMapping("/block/{userId}")
    public ResponseEntity<String> blockUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.blockUser(userId));
    }

    @PutMapping("/unblock/{userId}")
    public ResponseEntity<String> unblockUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.unblockUser(userId));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<AdminDashboardSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(userService.getDashboardSummary());
    }
}
