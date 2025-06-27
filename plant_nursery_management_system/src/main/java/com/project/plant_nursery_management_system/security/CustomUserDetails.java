package com.project.plant_nursery_management_system.security;

import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.model.onlyenums.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) { this.user = user; }

    public Long getId() {
        return user.getId();
    }

    public boolean isAdmin() {
        return user.getRole() == Role.ROLE_ADMIN;
    }

    // ✅ Expose role
    public Role getRole() {
        return user.getRole();
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole().name()));
    }

    @Override public String getPassword() { return user.getPassword(); }
    @Override public String getUsername() { return user.getEmail(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

