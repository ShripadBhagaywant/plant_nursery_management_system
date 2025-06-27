package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
}
