package com.project.plant_nursery_management_system.dto.request;

import com.project.plant_nursery_management_system.model.onlyenums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterUserRequest {

    @NotBlank
    private String name;
    @Email
    @NotBlank private String email;
    @Size(min = 8) private String password;
    private Role role;          // optional; defaults to USER


    public @NotBlank String getName() {
        return name;
    }

    public void setName(@NotBlank String name) {
        this.name = name;
    }

    public @Email @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotBlank String email) {
        this.email = email;
    }

    public @Size(min = 8) String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8) String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
