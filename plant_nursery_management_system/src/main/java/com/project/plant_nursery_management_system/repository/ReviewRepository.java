package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {


    Optional<Review> findByUserIdAndPlantId(Long userId, Long plantId);
    List<Review> findByPlantId(Long plantId);
    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.plant.id = :plantId")
    Double findAverageRatingByPlantId(@Param("plantId") Long plantId);

    Page<Review> findAll(Pageable pageable);

}
