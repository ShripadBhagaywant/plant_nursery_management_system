package com.project.plant_nursery_management_system.exception;

public class InsufficientStockException extends  RuntimeException{

    public InsufficientStockException(String message) {
        super(message);
    }
}
