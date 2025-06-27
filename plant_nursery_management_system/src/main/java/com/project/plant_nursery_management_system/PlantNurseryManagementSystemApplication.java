package com.project.plant_nursery_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class PlantNurseryManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlantNurseryManagementSystemApplication.class, args);
	}

}
