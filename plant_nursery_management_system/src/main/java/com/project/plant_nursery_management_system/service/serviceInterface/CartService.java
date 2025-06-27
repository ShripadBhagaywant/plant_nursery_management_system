package com.project.plant_nursery_management_system.service.serviceInterface;

import com.project.plant_nursery_management_system.dto.CartItemDto;
import com.project.plant_nursery_management_system.model.Cart;

public interface CartService {
    Cart addToCart(Long userId, CartItemDto itemDto);
    Cart updateQuantity(Long userId, CartItemDto itemDto);
    Cart removeFromCart(Long userId, Long plantId);
    void clearCart(Long userId);
    Cart getCartByUserId(Long userId);
    void deleteCart(Long userId);
}
