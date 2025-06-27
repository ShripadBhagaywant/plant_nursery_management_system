package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.InventoryDto;
import com.project.plant_nursery_management_system.dto.PlantDto;
import com.project.plant_nursery_management_system.dto.mapper.InventoryMapper;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Inventory;
import com.project.plant_nursery_management_system.model.Plant;
import com.project.plant_nursery_management_system.repository.InventoryRepository;
import com.project.plant_nursery_management_system.repository.PlantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {


    private final InventoryRepository inventoryRepository;


    private final PlantRepository plantRepository;

    public InventoryService(InventoryRepository inventoryRepository, PlantRepository plantRepository) {
        this.inventoryRepository = inventoryRepository;
        this.plantRepository = plantRepository;
    }

    public InventoryDto addOrUpdateInventory(InventoryDto dto) {
        Plant plant = plantRepository.findById(dto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found with ID: " + dto.getPlantId()));

        Inventory inventory = inventoryRepository.findByPlant_Id(dto.getPlantId())
                .orElse(null);

        if (inventory == null) {
            inventory = new Inventory();
        }

        // 🔒 Must always reset Plant and ID correctly
        inventory.setPlant(plant); // ensure this is *never* null
        inventory.setQuantity(dto.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());

        Inventory saved = inventoryRepository.save(inventory);
        return InventoryMapper.toDTO(saved);
    }

    public InventoryDto getInventoryByPlantId(Long plantId) {
        Inventory inventory = inventoryRepository.findByPlant_Id(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        return InventoryMapper.toDTO(inventory);
    }

    public List<InventoryDto> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(InventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<InventoryDto> getPaginatedInventory(String search, Pageable pageable) {
        Page<Inventory> page;

        if (search == null || search.trim().isEmpty()) {
            page = inventoryRepository.findAll(pageable);
        } else {
            page = inventoryRepository.findByPlant_NameContainingIgnoreCase(search, pageable);
        }

        return page.map(InventoryMapper::toDTO);
    }


    public List<InventoryDto> getLowStock(int threshold)
    {
        return inventoryRepository.findByQuantityLessThanEqual(threshold)
                .stream()
                .map(InventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteByPlantId(Long plantId) {
        Inventory inventory = inventoryRepository.findByPlant_Id(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        inventoryRepository.delete(inventory);
    }


    public InventoryDto addQuantity(Long plantId, int quantityToAdd) {
        Inventory inventory = inventoryRepository.findByPlant_Id(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        inventory.setQuantity(inventory.getQuantity() + quantityToAdd);
        return InventoryMapper.toDTO(inventoryRepository.save(inventory));
    }

    public InventoryDto reduceQuantity(Long plantId, int quantityToRemove) {
        Inventory inventory = inventoryRepository.findByPlant_Id(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        int newQty = inventory.getQuantity() - quantityToRemove;
        if (newQty < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        inventory.setQuantity(newQty);
        return InventoryMapper.toDTO(inventoryRepository.save(inventory));
    }


    public List<PlantDto> getPlantsNotInInventory() {
        List<Long> ids = inventoryRepository.findAll()
                .stream()
                .map(i -> i.getPlant().getId())
                .toList();

        List<Plant> availablePlants = ids.isEmpty()
                ? plantRepository.findAll()
                : plantRepository.findByIdNotIn(ids);

        return availablePlants.stream()
                .map(p -> new PlantDto(p.getId(),p.getName(),p.getImagePath()))
                .toList();
    }

    public InventoryDto addInventoryForNewPlant(InventoryDto dto) {
        if (inventoryRepository.existsByPlant_Id(dto.getPlantId())) {
            throw new IllegalArgumentException("Inventory already exists");
        }

        Plant plant = plantRepository.findById(dto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        Inventory inventory = new Inventory();
        inventory.setPlant(plant);
        inventory.setQuantity(dto.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());

        return InventoryMapper.toDTO(inventoryRepository.save(inventory));
    }


}
