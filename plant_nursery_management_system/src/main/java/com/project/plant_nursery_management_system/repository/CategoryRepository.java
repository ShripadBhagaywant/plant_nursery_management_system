package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Category;
import com.project.plant_nursery_management_system.model.onlyenums.CategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    Optional<Category> findByName(CategoryType name);

    @Query("SELECT c FROM Category c WHERE " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR STR(c.name) = UPPER(:keyword)")
    Page<Category> searchByTypeOrDescription(@Param("keyword") String keyword, Pageable pageable);

}
