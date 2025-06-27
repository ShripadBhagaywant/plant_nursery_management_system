package com.project.plant_nursery_management_system.dto.mapper;

import com.project.plant_nursery_management_system.dto.request.ReviewRequestDto;
import com.project.plant_nursery_management_system.dto.response.ReviewResponseDto;
import com.project.plant_nursery_management_system.model.Plant;
import com.project.plant_nursery_management_system.model.Review;
import com.project.plant_nursery_management_system.model.User;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;

@Component
public class ReviewMapper {

    public Review toEntity(ReviewRequestDto dto, User user, Plant plant) {
        Review review = new Review();
        review.setUser(user);
        review.setPlant(plant);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());
        return review;
    }

    public ReviewResponseDto toDto(Review review) {
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUsername(review.getUser().getName());
        dto.setPlantName(review.getPlant().getName());
        dto.setUserId(review.getUser().getId()); // ✅ Correct
        return dto;
    }



    public void updateEntity(Review review, ReviewRequestDto dto) {
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setUpdatedAt(LocalDateTime.now());
    }
}


