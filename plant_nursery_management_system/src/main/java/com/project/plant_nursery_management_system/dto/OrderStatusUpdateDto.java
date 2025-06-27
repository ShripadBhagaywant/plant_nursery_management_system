package com.project.plant_nursery_management_system.dto;

import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;

public class OrderStatusUpdateDto {

    private OrderStatus orderStatus;

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }
}
