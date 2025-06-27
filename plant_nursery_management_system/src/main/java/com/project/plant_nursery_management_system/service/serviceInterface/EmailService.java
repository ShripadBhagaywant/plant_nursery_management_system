package com.project.plant_nursery_management_system.service.serviceInterface;

import com.project.plant_nursery_management_system.dto.EmailDetails;

public interface EmailService {
    void sendEmailAsync(EmailDetails details);
}
