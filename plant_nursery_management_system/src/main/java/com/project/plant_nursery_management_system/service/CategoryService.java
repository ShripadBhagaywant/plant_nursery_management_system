package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.CategoryDto;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Category;
import com.project.plant_nursery_management_system.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService {


    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.findByName(dto.getType()).isPresent()) {
            throw new RuntimeException("Category with name " + dto.getType() + " already exists");
        }
        Category category = new Category();
        category.setName(dto.getType());
        category.setDescription(dto.getDescription());
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());

        return mapToDto(categoryRepository.save(category));
    }

    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(dto.getType());
        category.setDescription(dto.getDescription());
        category.setUpdatedAt(LocalDateTime.now());

        return mapToDto(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));


        if (category.getPlants() != null && !category.getPlants().isEmpty()) {
            throw new IllegalStateException("Cannot delete category with associated plants.");
        }

        categoryRepository.delete(category);
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapToDto(category);
    }

    public Map<String, Object> getCategoriesWithMeta(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Page<Category> categoryPage;
        if (keyword == null || keyword.trim().isEmpty()) {
            categoryPage = categoryRepository.findAll(pageable);
        } else {
            categoryPage = categoryRepository.searchByTypeOrDescription(keyword, pageable);
        }

        List<CategoryDto> categoryDtos = categoryPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("categories", categoryDtos);
        response.put("currentPage", categoryPage.getNumber());
        response.put("totalItems", categoryPage.getTotalElements());
        response.put("totalPages", categoryPage.getTotalPages());
        response.put("isLastPage", categoryPage.isLast());

        return response;
    }


    private CategoryDto mapToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setType(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}

