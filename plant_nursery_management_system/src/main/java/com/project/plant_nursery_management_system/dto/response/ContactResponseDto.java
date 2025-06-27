package com.project.plant_nursery_management_system.dto.response;

import java.time.LocalDateTime;

public class ContactResponseDto {
    private Long id;
    private String UserName;
    private String UserEmail;
    private String subject;
    private String message;
    private LocalDateTime createdAt;
    private boolean resolved;
    private Long userId;

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getUserEmail() {
        return UserEmail;
    }

    public void setUserEmail(String userEmail) {
        UserEmail = userEmail;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return UserName;
    }

    public void setName(String UserName) {
        this.UserName = UserName;
    }

    public String getEmail() {
        return UserEmail;
    }

    public void setEmail(String email) {
        this.UserEmail = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }
}
