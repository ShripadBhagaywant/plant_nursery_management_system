package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Kyc;
import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.model.onlyenums.KycStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KycRepository extends JpaRepository<Kyc,Long> {
    Optional<Kyc> findByUserId(Long userId);



    Page<Kyc> findAllByStatus(KycStatus status, Pageable pageable);
}
