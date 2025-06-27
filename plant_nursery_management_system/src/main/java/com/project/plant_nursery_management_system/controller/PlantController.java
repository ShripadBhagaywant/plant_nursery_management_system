package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.PlantDto;
import com.project.plant_nursery_management_system.dto.request.PlantRequest;
import com.project.plant_nursery_management_system.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.util.MimeTypeUtils;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/plants")
public class PlantController {


    private final PlantService plantService;

    @Value("${file.upload-plant}")
    private  String uploadDir;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PlantDto> addPlant(
            @Valid @ModelAttribute PlantRequest plantRequest
    ) throws IOException {
        return ResponseEntity.ok(plantService.addPlant(plantRequest, plantRequest.getImage()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlantDto> updatePlant(
            @PathVariable Long id,
            @Valid @ModelAttribute PlantRequest plantRequest
    ) throws IOException {
        return ResponseEntity.ok(plantService.updatePlant(id, plantRequest, plantRequest.getImage()));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPlants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "All") String category
    ) {

        return ResponseEntity.ok(plantService.getPlants(page, size, sortBy, keyword, category));
    }


    @GetMapping("/{id}")
    public ResponseEntity<PlantDto> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }


    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            File file = new File(uploadDir + File.separator + filename);

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Path path = file.toPath();
            String contentType = Files.probeContentType(path); // auto detect MIME type

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE))
                    .body(new FileSystemResource(file));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not load image: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPlantNames() {
        return ResponseEntity.ok(plantService.getAllPlants());
    }


}
