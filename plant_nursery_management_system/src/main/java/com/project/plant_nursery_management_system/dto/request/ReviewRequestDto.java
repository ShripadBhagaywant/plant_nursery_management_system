package com.project.plant_nursery_management_system.dto.request;

import jakarta.validation.constraints.*;

public class ReviewRequestDto {

    @NotNull(message = "Plant ID is required")
    private Long plantId;

    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 3, max = 500, message = "Comment must be between 3 and 500 characters")
    private String comment;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private int rating;

    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public @NotNull(message = "Plant ID is required") Long getPlantId() {
        return plantId;
    }

    public void setPlantId(@NotNull(message = "Plant ID is required") Long plantId) {
        this.plantId = plantId;
    }

    public @NotBlank(message = "Comment cannot be blank") @Size(min = 3, max = 500, message = "Comment must be between 3 and 500 characters") String getComment() {
        return comment;
    }

    public void setComment(@NotBlank(message = "Comment cannot be blank") @Size(min = 3, max = 500, message = "Comment must be between 3 and 500 characters") String comment) {
        this.comment = comment;
    }

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    public int getRating() {
        return rating;
    }

    public void setRating(@Min(value = 1, message = "Rating must be at least 1") @Max(value = 5, message = "Rating cannot be more than 5") int rating) {
        this.rating = rating;
    }
}
