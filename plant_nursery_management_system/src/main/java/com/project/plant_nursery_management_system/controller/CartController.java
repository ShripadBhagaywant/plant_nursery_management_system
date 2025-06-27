package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.CartDto;
import com.project.plant_nursery_management_system.dto.CartItemDto;
import com.project.plant_nursery_management_system.dto.mapper.CartMapper;
import com.project.plant_nursery_management_system.model.Cart;
import com.project.plant_nursery_management_system.service.serviceInterface.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {


    private final CartService cartService;


    private final CartMapper cartMapper;

    public CartController(CartService cartService, CartMapper cartMapper) {
        this.cartService = cartService;
        this.cartMapper = cartMapper;
    }

    // ✅ Add item to cart
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartDto> addToCart(@PathVariable Long userId,
                                             @Valid @RequestBody CartItemDto cartItemDto) {
        Cart updatedCart = cartService.addToCart(userId, cartItemDto);
        CartDto cartDto = cartMapper.toDto(updatedCart);
        return ResponseEntity.ok(cartDto);
    }

    // ✅ Update quantity of item in cart
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/{userId}/update")
    public ResponseEntity<CartDto> updateQuantity(@PathVariable Long userId,
                                                  @Valid @RequestBody CartItemDto cartItemDto) {
        Cart updatedCart = cartService.updateQuantity(userId, cartItemDto);
        CartDto cartDto = cartMapper.toDto(updatedCart);
        return ResponseEntity.ok(cartDto);
    }

    // ✅ Remove item from cart
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/{userId}/remove/{plantId}")
    public ResponseEntity<CartDto> removeFromCart(@PathVariable Long userId,
                                                  @PathVariable Long plantId) {
        Cart updatedCart = cartService.removeFromCart(userId, plantId);
        CartDto cartDto = cartMapper.toDto(updatedCart);
        return ResponseEntity.ok(cartDto);
    }

    // ✅ Clear all items from cart
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    // ✅ Get cart for user
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        CartDto cartDto = cartMapper.toDto(cart);
        return ResponseEntity.ok(cartDto);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteCart(@PathVariable Long userId)
    {
        cartService.deleteCart(userId);
        return ResponseEntity.ok("Cart deleted successfully");
    }
}
