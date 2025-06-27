package com.project.plant_nursery_management_system.service.serviceInterface;

import com.project.plant_nursery_management_system.dto.request.ReviewRequestDto;
import com.project.plant_nursery_management_system.dto.response.ReviewResponseDto;

import java.util.List;

public interface ReviewService {
    ReviewResponseDto addOrUpdateReviewByEmail(String email, ReviewRequestDto dto);
    void deleteReviewByEmail(String email, Long plantId);
    List<ReviewResponseDto> getReviewsForPlant(Long plantId);
    List<ReviewResponseDto> getReviewsByEmail(String email);
    double getAverageRatingForPlant(Long plantId);
    ReviewResponseDto updateReviewByEmail(Long reviewId, ReviewRequestDto dto, String email);

    List<ReviewResponseDto> getAllReviewsWithFilters(int page, int size, String username, String plantName, Integer rating);

    void deleteReviewById(Long reviewId);


}
