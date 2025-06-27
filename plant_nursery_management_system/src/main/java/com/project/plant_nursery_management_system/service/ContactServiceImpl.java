package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.mapper.ContactMapper;
import com.project.plant_nursery_management_system.dto.request.ContactRequestDto;
import com.project.plant_nursery_management_system.dto.response.ContactResponseDto;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Contact;
import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.repository.ContactRepository;
import com.project.plant_nursery_management_system.repository.UserRepository;
import com.project.plant_nursery_management_system.service.serviceInterface.ContactService;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import com.project.plant_nursery_management_system.util.HtmlTemplateUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final ContactMapper contactMapper;

    private EmailService emailService;

    private HtmlTemplateUtil htmlTemplateUtil;

    public ContactServiceImpl(ContactRepository contactRepository, UserRepository userRepository, ContactMapper contactMapper, EmailService emailService, HtmlTemplateUtil htmlTemplateUtil) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.contactMapper = contactMapper;
        this.emailService = emailService;
        this.htmlTemplateUtil = htmlTemplateUtil;
    }


    @Override
    public ContactResponseDto createContact(ContactRequestDto dto) {
        // Extract logged-in user's email from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // This works if your JWT contains the username/email

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Contact contact = new Contact();
        contact.setSubject(dto.getSubject());
        contact.setMessage(dto.getMessage());
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUser(user);

        try {
            EmailDetails adminEmail = new EmailDetails();
            adminEmail.setRecipient("teachshri@gmail.com");
            adminEmail.setSubject("New Contact Form Submission");
            adminEmail.setTemplateName("contact-received.html");

            Map<String, String> adminPlaceholders = new HashMap<>();
            adminPlaceholders.put("name", user.getName());
            adminPlaceholders.put("message", dto.getMessage());

            String adminTemplate = htmlTemplateUtil.loadTemplate(adminEmail.getTemplateName());
            String adminBody = htmlTemplateUtil.replacePlaceholders(adminTemplate, adminPlaceholders);
            adminEmail.setBody(adminBody);

            emailService.sendEmailAsync(adminEmail);
        }catch (Exception e)
        {
            throw  new RuntimeException("Email Service not Working..");
        }

        return contactMapper.toDto(contactRepository.save(contact));
    }


    @Override
    public List<ContactResponseDto> getAllContacts() {
        return contactRepository.findAll().stream()
                .map(contactMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public String resolvedUserQuery(Long userId) {

        var user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setResolved(true);

        userRepository.save(user);

        List<Contact> contacts = contactRepository.findByUserId(userId);
        for (Contact contact : contacts) {
            contact.setResolved(true);
        }
        contactRepository.saveAll(contacts);

        return "User issues and contact messages marked as resolved. ";
    }

    @Override
    public Page<ContactResponseDto> getFilteredContacts(int page, int size, Boolean resolved) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> pageData = resolved == null
                ? contactRepository.findAll(pageable)
                : contactRepository.findByResolved(resolved, pageable);
        return pageData.map(contactMapper::toDto);
    }

    @Override
    public String resolveSingleContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        contact.setResolved(true);
        contactRepository.save(contact);
        return "Contact marked as resolved.";
    }

    @Override
    public void deleteContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        contactRepository.delete(contact);
    }


}

