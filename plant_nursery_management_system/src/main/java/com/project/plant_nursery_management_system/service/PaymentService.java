package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.PaymentVerificationDTO;
import com.project.plant_nursery_management_system.dto.mapper.PaymentMapper;
import com.project.plant_nursery_management_system.dto.request.PaymentRequestDTO;
import com.project.plant_nursery_management_system.dto.response.PaymentResponseDto;
import com.project.plant_nursery_management_system.exception.InvalidInputException;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.Order;
import com.project.plant_nursery_management_system.model.Payment;
import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;
import com.project.plant_nursery_management_system.model.onlyenums.PaymentStatus;
import com.project.plant_nursery_management_system.repository.OrderRepository;
import com.project.plant_nursery_management_system.repository.PaymentRepository;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import com.project.plant_nursery_management_system.util.HtmlTemplateUtil;
import com.project.plant_nursery_management_system.util.RazorpaySignatureUtil;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final OrderRepository orderRepository;

    private final RazorpayClient razorpayClient;


    private final String razorpaySecret;

    private final EmailService emailService;

    private final HtmlTemplateUtil htmlTemplateUtil;


    private final String razorpayKey;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          RazorpayClient razorpayClient,
                          @Value("${razorpay.secret}")String razorpaySecret,
                          EmailService emailService,
                          HtmlTemplateUtil htmlTemplateUtil,
                          @Value("${razorpay.key}")String razorpayKey) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.razorpayClient = razorpayClient;
        this.razorpaySecret = razorpaySecret;
        this.emailService = emailService;
        this.htmlTemplateUtil = htmlTemplateUtil;
        this.razorpayKey = razorpayKey;
    }


    @Transactional
    public PaymentResponseDto createOrder(PaymentRequestDTO requestDTO) {
        try {
            if (requestDTO.getOrderId() == null || requestDTO.getOrderId() <= 0) {
                throw new InvalidInputException("Invalid order ID");
            }

            Order order = orderRepository.findById(requestDTO.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + requestDTO.getOrderId()));

            if (order.getTotalAmount() == null || order.getTotalAmount() <= 0) {
                throw new InvalidInputException("Invalid order amount");
            }

            JSONObject options = new JSONObject();
            options.put("amount", (int) (order.getTotalAmount() * 100)); // Razorpay takes amount in paise
            options.put("currency", "INR");
            options.put("receipt", "order_rcptid_" + order.getId());
            options.put("payment_capture", 1);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setStatus(PaymentStatus.CREATED);
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setPaymentMethod("ONLINE");

            paymentRepository.save(payment);

            PaymentResponseDto response = PaymentMapper.toPaymentResponseDTO(payment);
            response.setKey(razorpayKey);
            return response;


        } catch (InvalidInputException | ResourceNotFoundException e) {
            throw e;
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order with Razorpay: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponseDto verifyPayment(PaymentVerificationDTO dto) {
        if (dto.getRazorpayOrderId() == null || dto.getRazorpayOrderId().trim().isEmpty() ||
                dto.getRazorpayPaymentId() == null || dto.getRazorpayPaymentId().trim().isEmpty() ||
                dto.getRazorpaySignature() == null || dto.getRazorpaySignature().trim().isEmpty()) {
            throw new InvalidInputException("Missing or empty payment verification details");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(dto.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order ID: " + dto.getRazorpayOrderId()));

        boolean isValid = RazorpaySignatureUtil.verifySignature(
                dto.getRazorpayOrderId(),
                dto.getRazorpayPaymentId(),
                dto.getRazorpaySignature(),
                razorpaySecret
        );

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new InvalidInputException("Payment signature verification failed");
        }

        payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
        payment.setRazorpaySignature(dto.getRazorpaySignature());
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDateTime.now());


        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        try {
            User user = order.getUser();

            if (user != null && user.getEmail() != null) {
                EmailDetails details = new EmailDetails();
                details.setRecipient(user.getEmail());
                details.setSubject("Welcome!");
                details.setTemplateName("payment-confirmation.html");

                Map<String, String> placeholders = new HashMap<>();
                placeholders.put("username", user.getName());
                placeholders.put("amount", String.valueOf(payment.getAmount()));

                String template = htmlTemplateUtil.loadTemplate(details.getTemplateName());
                String body = htmlTemplateUtil.replacePlaceholders(template, placeholders);
                details.setBody(body);

                emailService.sendEmailAsync(details);
            }

        }catch (Exception e)
        {
            throw  new RuntimeException("Email Service not Working..");
        }


        return PaymentMapper.toPaymentResponseDTO(payment);
    }


    public List<PaymentResponseDto> getRecentPayments() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("paymentDate").descending());
        List<Payment> payments = paymentRepository.findAll(pageable).getContent();

        return payments.stream()
                .map(PaymentMapper::toPaymentResponseDTO) // your existing mapper
                .collect(Collectors.toList());
    }

    public List<PaymentResponseDto> getPaymentsByStatus(String status) {
        PaymentStatus paymentStatus;

        try {
            paymentStatus = PaymentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid payment status: " + status);
        }

        List<Payment> payments = paymentRepository.findByStatus(paymentStatus);
        return payments.stream()
                .map(PaymentMapper::toPaymentResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<PaymentResponseDto> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(PaymentMapper::toPaymentResponseDTO);
    }


}