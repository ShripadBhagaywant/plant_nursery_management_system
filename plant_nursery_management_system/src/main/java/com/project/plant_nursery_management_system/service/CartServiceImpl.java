package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.CartItemDto;
import com.project.plant_nursery_management_system.dto.mapper.CartMapper;
import com.project.plant_nursery_management_system.exception.BlockedUserException;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.*;
import com.project.plant_nursery_management_system.repository.CartItemRepository;
import com.project.plant_nursery_management_system.repository.CartRepository;
import com.project.plant_nursery_management_system.repository.PlantRepository;
import com.project.plant_nursery_management_system.repository.UserRepository;
import com.project.plant_nursery_management_system.service.serviceInterface.CartService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
public class CartServiceImpl implements CartService {


    private final CartRepository cartRepository;


    private final CartItemRepository cartItemRepository;


    private final UserRepository userRepository;


    private final PlantRepository plantRepository;


    private final CartMapper cartMapper;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository, PlantRepository plantRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.plantRepository = plantRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    public Cart addToCart(Long userId, CartItemDto itemDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(user.isBlocked())
        {
            throw new BlockedUserException("Your account is blocked. You cannot perform this operation.");
        }

        Plant plant = plantRepository.findById(itemDto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return newCart;
        });

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getPlant().getId().equals(plant.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + itemDto.getQuantity());
            existingItem.setPrice(existingItem.getQuantity() * plant.getPrice());
        } else {
            CartItem newItem = new CartItem();
            newItem.setPlant(plant);
            newItem.setQuantity(itemDto.getQuantity());
            newItem.setPrice(itemDto.getQuantity() * plant.getPrice());
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateQuantity(Long userId, CartItemDto itemDto) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getPlant().getId().equals(itemDto.getPlantId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found in cart"));

        Plant plant = plantRepository.findById(itemDto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        item.setQuantity(itemDto.getQuantity());
        item.setPrice(itemDto.getQuantity() * plant.getPrice());

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeFromCart(Long userId, Long plantId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getPlant().getId().equals(plantId));

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));
    }

    private void updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(CartItem::getPrice)
                .sum();
        cart.setTotalPrice(total);
    }

    @Override
    public void deleteCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cartRepository.delete(cart); // Deletes cart and its items (due to cascade)
    }

}
