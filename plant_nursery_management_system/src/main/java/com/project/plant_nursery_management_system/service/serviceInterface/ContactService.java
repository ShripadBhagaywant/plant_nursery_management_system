package com.project.plant_nursery_management_system.service.serviceInterface;

import com.project.plant_nursery_management_system.dto.request.ContactRequestDto;
import com.project.plant_nursery_management_system.dto.response.ContactResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ContactService {
    ContactResponseDto createContact(ContactRequestDto requestDto);
    List<ContactResponseDto> getAllContacts();

    String resolvedUserQuery(Long userId);

    Page<ContactResponseDto> getFilteredContacts(int page, int size, Boolean resolved);
    String resolveSingleContact(Long contactId);

    public void deleteContact(Long contactId);

}
