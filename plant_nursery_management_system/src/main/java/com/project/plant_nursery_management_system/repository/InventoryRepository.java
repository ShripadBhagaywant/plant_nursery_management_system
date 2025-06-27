package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByPlant_Id(Long plantId);

    Page<Inventory> findByPlant_NameContainingIgnoreCase(String name, Pageable pageable);

    List<Inventory> findByQuantityLessThanEqual(int quantity);

    boolean existsByPlant_Id(Long plantId);

}
