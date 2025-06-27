package com.project.plant_nursery_management_system.service.serviceInterface;

import com.project.plant_nursery_management_system.dto.OrderDto;
import com.project.plant_nursery_management_system.model.Order;
import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;

import java.util.List;


public interface OrderService {
    Order placeOrder(OrderDto orderDTO);
    Order getOrderById(Long id);
    List<Order> getOrdersByUserId(Long userId);
    List<Order> getAllOrders();

    Order cancelOrder(Long orderId);
    Order updateOrder(Long orderId, OrderDto updatedOrderDTO);
    void deleteOrder(Long orderId , Long userId, boolean isAdmin);

    Order updateOrderStatus(Long orderId, OrderStatus status);
}
