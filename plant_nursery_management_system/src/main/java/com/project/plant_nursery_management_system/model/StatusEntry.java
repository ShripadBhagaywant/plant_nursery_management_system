package com.project.plant_nursery_management_system.model;


import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDateTime;

@Embeddable
public class StatusEntry {

    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime timestamp;

    public StatusEntry() {
    }

    public StatusEntry(OrderStatus status, LocalDateTime timestamp) {
        this.status = status;
        this.timestamp = timestamp;
    }

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
