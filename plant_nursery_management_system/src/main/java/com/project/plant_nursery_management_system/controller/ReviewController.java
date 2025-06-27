package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.request.ReviewRequestDto;
import com.project.plant_nursery_management_system.dto.response.ReviewResponseDto;
import com.project.plant_nursery_management_system.service.serviceInterface.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> addOrUpdateReview(@RequestBody @Valid ReviewRequestDto dto,
                                               Authentication authentication) {
        String email = authentication.getName(); // From JWT token
        ReviewResponseDto response = reviewService.addOrUpdateReviewByEmail(email, dto);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @DeleteMapping("/{plantId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long plantId,
                                          Authentication authentication) {
        String email = authentication.getName();
        reviewService.deleteReviewByEmail(email, plantId);
        return ResponseEntity.ok("Review deleted successfully.");
    }

    @GetMapping("/plant/{plantId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsForPlant(@PathVariable Long plantId) {
        return ResponseEntity.ok(reviewService.getReviewsForPlant(plantId));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/user")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reviewService.getReviewsByEmail(email));
    }

    @GetMapping("/average-rating/{plantId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long plantId) {
        return ResponseEntity.ok(reviewService.getAverageRatingForPlant(plantId));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDto> updateReview(@PathVariable Long reviewId,
                                                          @RequestBody @Valid ReviewRequestDto dto,
                                                          Authentication authentication) {
        String email = authentication.getName();
        ReviewResponseDto updatedReview = reviewService.updateReviewByEmail(reviewId, dto, email);
        return ResponseEntity.ok(updatedReview);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<ReviewResponseDto>> getAllReviews(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String plantName,
            @RequestParam(required = false) Integer rating
    ) {
        return ResponseEntity.ok(
                reviewService.getAllReviewsWithFilters(0, 0, username, plantName, rating)
        );
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/{reviewId}")
    public ResponseEntity<?> deleteReviewById(@PathVariable Long reviewId) {
        reviewService.deleteReviewById(reviewId);
        return ResponseEntity.ok("Review deleted by admin.");
    }


}
