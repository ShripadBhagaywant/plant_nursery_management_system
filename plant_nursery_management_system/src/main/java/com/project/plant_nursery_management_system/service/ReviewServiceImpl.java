package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.mapper.ReviewMapper;
import com.project.plant_nursery_management_system.dto.request.ReviewRequestDto;
import com.project.plant_nursery_management_system.dto.response.ReviewResponseDto;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Plant;
import com.project.plant_nursery_management_system.model.Review;
import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.repository.PlantRepository;
import com.project.plant_nursery_management_system.repository.ReviewRepository;
import com.project.plant_nursery_management_system.repository.UserRepository;
import com.project.plant_nursery_management_system.service.serviceInterface.ReviewService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             PlantRepository plantRepository,
                             UserRepository userRepository,
                             ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
        this.reviewMapper = reviewMapper;
    }

    @Override
    public ReviewResponseDto addOrUpdateReviewByEmail(String email, ReviewRequestDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Plant plant = plantRepository.findById(dto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        Review review = reviewRepository.findByUserIdAndPlantId(user.getId(), plant.getId())
                .orElse(new Review());

        review.setUser(user);
        review.setPlant(plant);
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());

        LocalDateTime now = LocalDateTime.now();

        if (review.getId() == null) {
            review.setCreatedAt(now);
        }

        review.setUpdatedAt(now);

        Review saved = reviewRepository.save(review);
        return reviewMapper.toDto(saved);
    }

    @Override
    public void deleteReviewByEmail(String email, Long plantId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findByUserIdAndPlantId(user.getId(), plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponseDto> getReviewsForPlant(Long plantId) {
        return reviewRepository.findByPlantId(plantId).stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponseDto> getReviewsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reviewRepository.findByUserId(user.getId()).stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public double getAverageRatingForPlant(Long plantId) {
        Double average = reviewRepository.findAverageRatingByPlantId(plantId);
        return average != null ?  average:0.0;
    }

    @Override
    public ReviewResponseDto updateReviewByEmail(Long reviewId, ReviewRequestDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to edit this review.");
        }

        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return reviewMapper.toDto(saved);
    }

    @Override
    public List<ReviewResponseDto> getAllReviewsWithFilters(int page, int size, String username, String plantName, Integer rating) {
        List<Review> reviews = reviewRepository.findAll();

        return reviews.stream()
                .filter(r -> username == null || r.getUser().getName().toLowerCase().contains(username.toLowerCase()))
                .filter(r -> plantName == null || r.getPlant().getName().toLowerCase().contains(plantName.toLowerCase()))
                .filter(r -> rating == null || r.getRating() == rating)
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public void deleteReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }



}
