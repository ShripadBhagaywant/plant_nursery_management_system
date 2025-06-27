package com.project.plant_nursery_management_system.repository;


import com.project.plant_nursery_management_system.model.Plant;
import com.project.plant_nursery_management_system.model.onlyenums.CategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {

    Page<Plant> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Plant> findByCategory_Name(CategoryType categoryName, Pageable pageable);
    Page<Plant> findByNameContainingIgnoreCaseAndCategory_Name(String name, CategoryType categoryName, Pageable pageable);

    List<Plant> findByIdNotIn(List<Long> ids);

}
