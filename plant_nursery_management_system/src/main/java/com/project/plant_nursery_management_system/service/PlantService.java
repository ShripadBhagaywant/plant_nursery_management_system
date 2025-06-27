package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.PlantDto;
import com.project.plant_nursery_management_system.dto.request.PlantRequest;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Category;
import com.project.plant_nursery_management_system.model.Plant;
import com.project.plant_nursery_management_system.model.onlyenums.CategoryType;
import com.project.plant_nursery_management_system.repository.CategoryRepository;
import com.project.plant_nursery_management_system.repository.InventoryRepository;
import com.project.plant_nursery_management_system.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class PlantService {


    private final PlantRepository plantRepository;


    private final CategoryRepository categoryRepository;


    private final InventoryRepository inventoryRepository;


    @Value("${file.upload-plant}")
    private String uploadDir;


    public PlantService(PlantRepository plantRepository, CategoryRepository categoryRepository , InventoryRepository inventoryRepository) {
        this.plantRepository = plantRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public PlantDto addPlant(PlantRequest request, MultipartFile imageFile) throws IOException {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String fileName = saveImage(imageFile, request.getName());

        Plant plant = new Plant();
        plant.setName(request.getName());
        plant.setType(request.getType());
        plant.setPrice(request.getPrice());
        plant.setDescription(request.getDescription());
        plant.setImagePath(fileName);
        plant.setCategory(category);
        plant.setCreatedAt(LocalDateTime.now());
        plant.setUpdatedAt(LocalDateTime.now());
        plant.setBestSeller(request.isBestSeller());
        plant.setVerified(request.isVerified());

        return mapToDto(plantRepository.save(plant));
    }


    public Map<String, Object> getPlants(int page, int size, String sortBy, String keyword, String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Plant> plantPage;

        boolean hasKeyword = keyword != null && !keyword.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("All");

        if (hasKeyword && hasCategory) {
            plantPage = plantRepository.findByNameContainingIgnoreCaseAndCategory_Name(
                    keyword, parseCategoryEnum(category), pageable);
        } else if (hasKeyword) {
            plantPage = plantRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (hasCategory) {
            plantPage = plantRepository.findByCategory_Name(parseCategoryEnum(category), pageable);
        } else {
            plantPage = plantRepository.findAll(pageable);
        }

        List<PlantDto> dtoList = plantPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("plants", dtoList);
        response.put("currentPage", plantPage.getNumber());
        response.put("totalItems", plantPage.getTotalElements());
        response.put("totalPages", plantPage.getTotalPages());
        response.put("isLastPage", plantPage.isLast());

        return response;
    }

    private String saveImage(MultipartFile imageFile, String plantName) throws IOException {
        if (imageFile == null || imageFile.isEmpty()) return null;

        String fileName = "plant_" + plantName.replaceAll(" ", "_") + "_" + System.currentTimeMillis()
                + "." + StringUtils.getFilenameExtension(imageFile.getOriginalFilename());

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        File dest = new File(dir, fileName);
        imageFile.transferTo(dest);
        return fileName;
    }


    public PlantDto updatePlant(Long id, PlantRequest request, MultipartFile imageFile) throws IOException {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        plant.setName(request.getName());
        plant.setType(request.getType());
        plant.setPrice(request.getPrice());
        plant.setDescription(request.getDescription());
        plant.setCategory(category);
        plant.setUpdatedAt(LocalDateTime.now());

        if (imageFile != null && !imageFile.isEmpty()) {

            //Delete old img.
            deleteImage(plant.getImagePath());

            String fileName = saveImage(imageFile, request.getName());
            plant.setImagePath(fileName);
        }

        return mapToDto(plantRepository.save(plant));
    }

    public void deletePlant(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        // Delete image
        deleteImage(plant.getImagePath());


        plantRepository.delete(plant);
    }

    public PlantDto getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));
        return mapToDto(plant);
    }

    public List<Map<String, Object>> getAllPlants() {
        return plantRepository.findAll().stream()
                .filter(p -> p.getId() != null && p.getName() != null)
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("name", p.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }




    //Utility Method for delete the image file.
    private void deleteImage(String fileName) {
        if (fileName != null) {
            File file = new File(uploadDir + File.separator + fileName);
            if (file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    System.err.println("Failed to delete image file: " + file.getAbsolutePath());
                }
            }
            else {
                System.out.println("Image file not found: " + file.getAbsolutePath());
            }
        }
    }

    private CategoryType parseCategoryEnum(String category) {
        try {
            return CategoryType.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid category: " + category);
        }
    }




    private PlantDto mapToDto(Plant plant) {
        PlantDto dto = new PlantDto();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        dto.setType(plant.getType());
        dto.setPrice(plant.getPrice());
        dto.setDescription(plant.getDescription());
        dto.setImagePath("http://localhost:8080/api/plants/images/" + plant.getImagePath());
        dto.setBestSeller(plant.isBestSeller());
        dto.setVerified(plant.isVerified());
        if (plant.getCategory() != null) {
            dto.setCategoryId(plant.getCategory().getId());
            dto.setCategoryName(plant.getCategory().getName().name()); // .name() since it's an enum
        }

        if (plant.getInventory() != null) {
            dto.setQuantity(plant.getInventory().getQuantity());
        } else {
            dto.setQuantity(0); // or leave as null
        }


        return dto;
    }
}
