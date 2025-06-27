
package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.KycDto;
import com.project.plant_nursery_management_system.model.onlyenums.DocumentType;
import com.project.plant_nursery_management_system.model.onlyenums.KycStatus;
import com.project.plant_nursery_management_system.service.KycService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc")
public class KycController {


    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<KycDto> uploadKyc(
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage
    ) throws Exception {
        KycDto kycDto = kycService.saveKyc(documentType, frontImage, backImage);
        return ResponseEntity.ok(kycDto);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<KycDto> getMyKyc() {
        return ResponseEntity.ok(kycService.getKycForLoggedInUser());
    }


    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<KycDto>> getAllKycs(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(kycService.getAllKycs(pageable));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<KycDto> getKycByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(kycService.getKycByUserId(userId));
    }

    @PutMapping("/{kycId}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<KycDto> updateKycStatus(@PathVariable Long kycId,
                                                  @RequestParam KycStatus status) {
        return ResponseEntity.ok(kycService.updateKycStatus(kycId, status));
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<KycDto>> getKycsByStatus(@RequestParam KycStatus status,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(kycService.getKycsByStatus(status, pageable));
    }
}
