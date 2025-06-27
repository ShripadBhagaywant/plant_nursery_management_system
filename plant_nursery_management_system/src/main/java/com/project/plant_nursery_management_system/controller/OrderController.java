package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.OrderDto;
import com.project.plant_nursery_management_system.dto.OrderStatusUpdateDto;
import com.project.plant_nursery_management_system.dto.mapper.OrderMapper;
import com.project.plant_nursery_management_system.model.Order;
import com.project.plant_nursery_management_system.security.CustomUserDetails;
import com.project.plant_nursery_management_system.service.serviceInterface.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMapper orderMapper; // Correct: use injected mapper

    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderDto orderDTO) {
        Order order = orderService.placeOrder(orderDTO);
        return ResponseEntity.ok(orderMapper.toDto(order)); // Fixed: use instance
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(orderMapper.toDto(order));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable Long userId) {
        List<OrderDto> dtos = orderService.getOrdersByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> dtos = orderService.getAllOrders()
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long id) {
        Order order = orderService.cancelOrder(id);
        return ResponseEntity.ok(orderMapper.toDto(order));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDto orderDto) {
        Order updated = orderService.updateOrder(id, orderDto);
        return ResponseEntity.ok(orderMapper.toDto(updated));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        orderService.deleteOrder(
                orderId,
                userDetails.getId(),
                userDetails.isAdmin()
        );
        return ResponseEntity.ok("Order deleted successfully");
    }




    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/status/{id}")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateDto dto) {
        Order updated = orderService.updateOrderStatus(id, dto.getOrderStatus());
        return ResponseEntity.ok(orderMapper.toDto(updated));
    }

}
