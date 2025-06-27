package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.InventoryDto;
import com.project.plant_nursery_management_system.dto.PlantDto;
import com.project.plant_nursery_management_system.model.Inventory;
import com.project.plant_nursery_management_system.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {


    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update")
    public ResponseEntity<InventoryDto> addOrUpdateInventory(@Valid @RequestBody InventoryDto inventoryDTO) {
        InventoryDto saved = inventoryService.addOrUpdateInventory(inventoryDTO);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/{plantId}")
    public ResponseEntity<InventoryDto> getInventoryByPlant(@PathVariable Long plantId) {
        return ResponseEntity.ok(inventoryService.getInventoryByPlantId(plantId));
    }


    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<InventoryDto>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<InventoryDto>> getPaginatedInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastUpdated").descending());
        Page<InventoryDto> paginatedInventory = inventoryService.getPaginatedInventory(search, pageable);
        return new ResponseEntity<>(paginatedInventory, HttpStatus.OK);
    }


    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryDto>> getLowStockPlants(@RequestParam(defaultValue = "5") int threshold) {
        return ResponseEntity.ok(inventoryService.getLowStock(threshold));
    }

    @DeleteMapping("/{plantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long plantId) {
        inventoryService.deleteByPlantId(plantId);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{plantId}/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDto> addQuantity(
            @PathVariable Long plantId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(inventoryService.addQuantity(plantId, quantity));
    }

    @PutMapping("/{plantId}/reduce")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDto> reduceQuantity(
            @PathVariable Long plantId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(inventoryService.reduceQuantity(plantId, quantity));
    }

    @GetMapping("/available-plants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PlantDto>> getAvailablePlantsForInventory() {
        return ResponseEntity.ok(inventoryService.getPlantsNotInInventory());
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDto> addInventoryForNewPlant(@RequestBody @Valid InventoryDto dto) {
        return new ResponseEntity<>(inventoryService.addInventoryForNewPlant(dto), HttpStatus.CREATED);
    }

}
