package com.project.plant_nursery_management_system.dto.mapper;

import com.project.plant_nursery_management_system.dto.InventoryDto;
import com.project.plant_nursery_management_system.model.Inventory;
import com.project.plant_nursery_management_system.model.Plant;

import java.time.LocalDateTime;

public class InventoryMapper {

    public static InventoryDto toDTO(Inventory inventory) {
        InventoryDto dto = new InventoryDto();
        dto.setId(inventory.getId());
        dto.setPlantId(inventory.getPlant().getId());
        dto.setQuantity(inventory.getQuantity());
        dto.setLastUpdated(inventory.getLastUpdated());
        dto.setPlantName(inventory.getPlant().getName());
        dto.setPlantImageUrl("http://localhost:8080/api/plants/images/" + inventory.getPlant().getImagePath());
        return dto;
    }

    public static Inventory toEntity(InventoryDto dto, Plant plant) {
        Inventory inventory = new Inventory();
        inventory.setPlant(plant);
        inventory.setQuantity(dto.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());
        return inventory;
    }
}
