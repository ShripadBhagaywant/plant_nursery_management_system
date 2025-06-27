package com.project.plant_nursery_management_system.dto;

import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;

import java.time.LocalDateTime;

public class StatusEntryDto {
    private OrderStatus status;
    private LocalDateTime timestamp;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
