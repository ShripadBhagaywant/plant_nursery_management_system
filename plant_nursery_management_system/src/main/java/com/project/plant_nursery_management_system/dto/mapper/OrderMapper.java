package com.project.plant_nursery_management_system.dto.mapper;

import com.project.plant_nursery_management_system.dto.OrderDto;
import com.project.plant_nursery_management_system.dto.OrderItemDto;
import com.project.plant_nursery_management_system.dto.StatusEntryDto;
import com.project.plant_nursery_management_system.model.Order;
import com.project.plant_nursery_management_system.model.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setRecipientName(order.getUser().getName());
        dto.setUserId(order.getUser().getId());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCountry(order.getCountry());
        dto.setCity(order.getCity());
        dto.setState(order.getState());
        dto.setZipCode(order.getZipCode());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setItemTotal(order.getItemTotal());
        dto.setShippingCharge(order.getShippingCharge());
        dto.setTax(order.getTax());
        dto.setTotalAmount(order.getTotalAmount());


        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(this::toItemDto).collect(Collectors.toList());
        dto.setItems(itemDtos);

        dto.setStatusHistory(order.getStatusHistory()
                .stream()
                .map(se -> {
                    StatusEntryDto sDto = new StatusEntryDto();
                    sDto.setStatus(se.getStatus());
                    sDto.setTimestamp(se.getTimestamp());
                    return sDto;
                })
                .collect(Collectors.toList()));


        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setPlantId(item.getPlant().getId());
        dto.setPlantName(item.getPlant().getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
