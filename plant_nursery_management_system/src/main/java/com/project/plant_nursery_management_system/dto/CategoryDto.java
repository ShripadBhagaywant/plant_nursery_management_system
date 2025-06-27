package com.project.plant_nursery_management_system.dto;

import com.project.plant_nursery_management_system.model.onlyenums.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryDto {

    private Long id;

    @NotNull(message = "Category name must not be null")
    private CategoryType type;

    @NotBlank(message = "Description is required")
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @NotNull(message = "Category name must not be null") CategoryType getType() {
        return type;
    }

    public void setType(@NotNull(message = "Category name must not be null") CategoryType type) {
        this.type = type;
    }
}
