package com.project.plant_nursery_management_system.dto;

import com.project.plant_nursery_management_system.model.onlyenums.DocumentType;
import com.project.plant_nursery_management_system.model.onlyenums.KycStatus;

import java.time.LocalDateTime;

public class KycDto {

    private Long id;

    private DocumentType documentType;

    private String frontImage;

    private String backImage;

    private KycStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long userId;

    public KycDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(DocumentType documentType) { this.documentType = documentType; }

    public String getFrontImage() { return frontImage; }
    public void setFrontImage(String frontImage) { this.frontImage = frontImage; }

    public String getBackImage() { return backImage; }
    public void setBackImage(String backImage) { this.backImage = backImage; }

    public KycStatus getStatus() { return status; }
    public void setStatus(KycStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}

