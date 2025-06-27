package com.project.plant_nursery_management_system.dto.mapper;

import com.project.plant_nursery_management_system.dto.CartDto;
import com.project.plant_nursery_management_system.dto.CartItemDto;
import com.project.plant_nursery_management_system.model.Cart;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapper {

    public CartDto toDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setCartId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setTotalPrice(cart.getTotalPrice());

        List<CartItemDto> itemDtos = cart.getItems().stream().map(item -> {
            CartItemDto i = new CartItemDto();
            i.setId(item.getId());
            i.setPlantId(item.getPlant().getId());
            i.setPlantName(item.getPlant().getName());
            i.setQuantity(item.getQuantity());
            i.setPrice(item.getPrice());
            return i;
        }).toList();

        dto.setItems(itemDtos);
        return dto;
    }
}

