package com.project.plant_nursery_management_system.exception;

public class OrderModificationNotAllowedException extends RuntimeException{
    public OrderModificationNotAllowedException(String message) {
        super(message);
    }

}
