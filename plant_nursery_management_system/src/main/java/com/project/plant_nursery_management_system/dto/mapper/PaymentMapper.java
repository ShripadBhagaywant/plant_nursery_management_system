package com.project.plant_nursery_management_system.dto.mapper;


import com.project.plant_nursery_management_system.dto.response.PaymentResponseDto;
import com.project.plant_nursery_management_system.model.Payment;

public class PaymentMapper {

    public static PaymentResponseDto toPaymentResponseDTO(Payment payment) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setRazorpayOrderId(payment.getRazorpayOrderId());
        dto.setStatus(payment.getStatus());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        dto.setAmount(payment.getAmount());
        return dto;
    }
}
