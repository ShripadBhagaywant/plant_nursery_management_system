package com.project.plant_nursery_management_system.dto.mapper;

import com.project.plant_nursery_management_system.dto.response.ContactResponseDto;
import com.project.plant_nursery_management_system.model.Contact;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {

    public ContactResponseDto toDto(Contact contact) {
        ContactResponseDto dto = new ContactResponseDto();
        dto.setId(contact.getId());
        dto.setName(contact.getUser().getName());
        dto.setEmail(contact.getUser().getEmail());
        dto.setSubject(contact.getSubject());
        dto.setMessage(contact.getMessage());
        dto.setCreatedAt(contact.getCreatedAt());
        dto.setResolved(contact.getUser().isResolved());
        dto.setUserId(contact.getUser().getId());
        return dto;
    }
}
