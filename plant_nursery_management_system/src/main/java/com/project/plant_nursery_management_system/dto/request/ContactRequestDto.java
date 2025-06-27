package com.project.plant_nursery_management_system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ContactRequestDto {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;


    public @NotBlank(message = "Subject is required") String getSubject() {
        return subject;
    }

    public void setSubject(@NotBlank(message = "Subject is required") String subject) {
        this.subject = subject;
    }

    public @NotBlank(message = "Message is required") String getMessage() {
        return message;
    }

    public void setMessage(@NotBlank(message = "Message is required") String message) {
        this.message = message;
    }
}
