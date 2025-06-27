package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.request.ContactRequestDto;
import com.project.plant_nursery_management_system.dto.response.ContactResponseDto;
import com.project.plant_nursery_management_system.service.serviceInterface.ContactService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping
    public ResponseEntity<ContactResponseDto> submitContact(
            @RequestBody @Valid ContactRequestDto dto) {
        return ResponseEntity.ok(contactService.createContact(dto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<ContactResponseDto>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/resolve/{userId}")
    public ResponseEntity<String>isResolvedUserQuery(@PathVariable Long userId)
    {
        return ResponseEntity.ok(contactService.resolvedUserQuery(userId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/filter")
    public ResponseEntity<Page<ContactResponseDto>> getFilteredContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean resolved
    ) {
        return ResponseEntity.ok(contactService.getFilteredContacts(page, size, resolved));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/resolve/contact/{contactId}")
    public ResponseEntity<String> resolveSingleContact(@PathVariable Long contactId) {
        return ResponseEntity.ok(contactService.resolveSingleContact(contactId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{contactId}")
    public ResponseEntity<String> deleteContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.ok("Contact deleted successfully.");
    }


}
