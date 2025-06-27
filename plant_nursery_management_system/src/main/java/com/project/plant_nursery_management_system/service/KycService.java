package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.KycDto;
import com.project.plant_nursery_management_system.exception.BlockedUserException;
import com.project.plant_nursery_management_system.exception.KycException;
import com.project.plant_nursery_management_system.model.*;
import com.project.plant_nursery_management_system.model.onlyenums.DocumentType;
import com.project.plant_nursery_management_system.model.onlyenums.KycStatus;
import com.project.plant_nursery_management_system.repository.KycRepository;
import com.project.plant_nursery_management_system.repository.UserRepository;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import com.project.plant_nursery_management_system.util.HtmlTemplateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class KycService {


    private final KycRepository kycRepository;


    private final UserRepository userRepository;

    private final EmailService emailService;

    private final HtmlTemplateUtil htmlTemplateUtil;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public KycService(KycRepository kycRepository, UserRepository userRepository, EmailService emailService, HtmlTemplateUtil htmlTemplateUtil) {
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.htmlTemplateUtil = htmlTemplateUtil;
    }

    private static final String FRONT = "front";
    private static final String BACK = "back";

    public KycDto saveKyc(DocumentType documentType, MultipartFile frontImage, MultipartFile backImage) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if(user.isBlocked())
        {
            throw new BlockedUserException("Your account is blocked. You cannot perform this operation.");
        }

        if (kycRepository.findByUserId(user.getId()).isPresent()) {
            throw new KycException("KYC already submitted");
        }

        validateFileType(frontImage);
        validateFileType(backImage);

        if (frontImage.isEmpty() || backImage.isEmpty()) {
            throw new KycException("One or both image files are empty");
        }

        String frontImageName = generateFilename(user.getId(), FRONT, frontImage);
        String backImageName = generateFilename(user.getId(), BACK, backImage);

        try {
            saveFile(frontImage, frontImageName, user.getId());
            saveFile(backImage, backImageName, user.getId());
        } catch (IOException e) {
            e.printStackTrace(); // for debugging
            throw new KycException("Error saving image files: " + e.getMessage());
        }

        Kyc kyc = new Kyc();
        kyc.setUser(user);
        kyc.setDocumentType(documentType);
        kyc.setFrontImage("user_" + user.getId() + "/" + frontImageName);
        kyc.setBackImage("user_" + user.getId() + "/" + backImageName);
        kyc.setStatus(KycStatus.PENDING);
        kyc.setCreatedAt(LocalDateTime.now());
        kyc.setUpdatedAt(LocalDateTime.now());

        Kyc saved = kycRepository.save(kyc);
        return mapToDto(saved);
    }

    public KycDto getKycForLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(">> Logged-in email: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        System.out.println(">> Found user ID: " + user.getId());

        Kyc kyc = kycRepository.findByUserId(user.getId())
                .orElseThrow(() -> new KycException("KYC not found"));

        return mapToDto(kyc);
    }


    private void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new KycException("Only image files are allowed");
        }
    }

    private String generateFilename(Long userId, String label, MultipartFile file) {
        return label + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
    }

    private void saveFile(MultipartFile file, String filename, Long userId) throws IOException {
        File userDir = new File(uploadDir + File.separator + "user_" + userId);
        if (!userDir.exists()) {
            boolean created = userDir.mkdirs();
            System.out.println("Created directory: " + userDir.getAbsolutePath() + " -> " + created);
        }

        File destination = new File(userDir, filename);
        System.out.println("Saving file to: " + destination.getAbsolutePath());
        file.transferTo(destination);
    }



    public Page<KycDto> getAllKycs(Pageable pageable) {
        return kycRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public KycDto getKycByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(() -> new KycException("KYC not found for user"));
        return mapToDto(kyc);
    }

    public KycDto updateKycStatus(Long kycId, KycStatus status) {
        // 1. Fetch KYC by ID
        Kyc kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new KycException("KYC not found"));

        // 2. Update KYC status and timestamp
        kyc.setStatus(status);
        kyc.setUpdatedAt(LocalDateTime.now());
        Kyc updated = kycRepository.save(kyc);

        // 3. Prepare and send email notification
        try {
            String templateName = null;
            String subject = null;

            switch (status) {
                case APPROVED:
                    templateName = "kyc-approved.html";
                    subject = "KYC Approved";
                    break;
                case REJECTED:
                    templateName = "kyc-rejected.html";
                    subject = "KYC Rejected";
                    break;
                case PENDING:
                    templateName = "kyc-pending.html";
                    subject = "KYC Pending Review";
                    break;
            }

            if (templateName != null) {
                Map<String, String> placeholders = new HashMap<>();
                placeholders.put("username", updated.getUser().getName());

                String template = htmlTemplateUtil.loadTemplate(templateName);
                String body = htmlTemplateUtil.replacePlaceholders(template, placeholders);

                EmailDetails details = new EmailDetails();
                details.setRecipient(updated.getUser().getEmail());
                details.setSubject(subject);
                details.setBody(body);

                emailService.sendEmailAsync(details);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to send KYC status email", e);
        }

        return mapToDto(updated);
    }


    public Page<KycDto> getKycsByStatus(KycStatus status, Pageable pageable) {
        return kycRepository.findAllByStatus(status, pageable)
                .map(this::mapToDto);
    }


    private KycDto mapToDto(Kyc kyc) {
        KycDto dto = new KycDto();
        dto.setId(kyc.getId());
        dto.setUserId(kyc.getUser().getId());
        dto.setDocumentType(kyc.getDocumentType());
        dto.setFrontImage(kyc.getFrontImage());
        dto.setBackImage(kyc.getBackImage());
        dto.setStatus(kyc.getStatus());
        dto.setCreatedAt(kyc.getCreatedAt());
        dto.setUpdatedAt(kyc.getUpdatedAt());
        return dto;
    }
}
