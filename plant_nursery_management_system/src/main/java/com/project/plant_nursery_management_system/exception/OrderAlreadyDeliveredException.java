package com.project.plant_nursery_management_system.exception;

public class OrderAlreadyDeliveredException extends RuntimeException {

    public OrderAlreadyDeliveredException(String message) {
        super(message);
    }

}
