package com.project.plant_nursery_management_system.controller;

import com.project.plant_nursery_management_system.dto.PaymentVerificationDTO;
import com.project.plant_nursery_management_system.dto.request.PaymentRequestDTO;
import com.project.plant_nursery_management_system.dto.response.PaymentResponseDto;
import com.project.plant_nursery_management_system.exception.InvalidInputException;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPaymentOrder(@Valid @RequestBody PaymentRequestDTO paymentRequestDTO) {
        try {
            PaymentResponseDto responseDTO = paymentService.createOrder(paymentRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody PaymentVerificationDTO verificationDTO) {
        try {
            PaymentResponseDto responseDTO = paymentService.verifyPayment(verificationDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (InvalidInputException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/recent")
    public ResponseEntity<List<PaymentResponseDto>> getRecentPayments() {
        List<PaymentResponseDto> payments = paymentService.getRecentPayments();
        return ResponseEntity.ok(payments);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByStatus(@PathVariable String status) {
        List<PaymentResponseDto> payments = paymentService.getPaymentsByStatus(status.toUpperCase());
        return ResponseEntity.ok(payments);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<PaymentResponseDto>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PaymentResponseDto> payments = paymentService.getAllPayments(PageRequest.of(page, size, Sort.by("paymentDate").descending()));
        return ResponseEntity.ok(payments);
    }

}
