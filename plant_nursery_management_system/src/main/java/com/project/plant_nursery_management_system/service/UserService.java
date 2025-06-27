package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.AdminDashboardSummaryDto;
import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.request.PasswordResetOtpRequest;
import com.project.plant_nursery_management_system.dto.response.UserResponse;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.repository.*;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repo;

    private final OrderRepository orderRepository;

    private final PaymentRepository paymentRepository;

    private final PlantRepository plantRepository;

    private final CategoryRepository categoryRepository;

    private final ContactRepository contactRepository;

    private final ModelMapper mapper;

    private final EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder;

    private final KycRepository kycRepository;

    private final ReviewRepository reviewRepository;


    public UserService(UserRepository repo,
                       ModelMapper mapper,
                       OrderRepository orderRepository,
                       PaymentRepository paymentRepository,
                       PlantRepository plantRepository,
                       EmailService emailService,
                       BCryptPasswordEncoder passwordEncoder,
                       CategoryRepository categoryRepository,
                       ContactRepository contactRepository,
                       KycRepository kycRepository,
                       ReviewRepository reviewRepository


    ) {
        this.repo = repo;
        this.mapper = mapper;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.plantRepository = plantRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.categoryRepository = categoryRepository;
        this.contactRepository = contactRepository;
        this.kycRepository = kycRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<UserResponse> getAllUsers() {
        return repo.findAll().stream()
                .map(user -> mapper.map(user, UserResponse.class))
                .collect(Collectors.toList());
    }


    public String blockUser(Long userId) {
        var user = repo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setBlocked(true);
        repo.save(user);
        return "User blocked successfully.";
    }

    public String unblockUser(Long userId) {
        var user = repo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setBlocked(false);
        repo.save(user);
        return "User unblocked successfully.";
    }


    public AdminDashboardSummaryDto getDashboardSummary()
    {
        AdminDashboardSummaryDto summary = new AdminDashboardSummaryDto();
        summary.setTotalUsers(repo.count());
        summary.setTotalOrders(orderRepository.count());
        summary.setTotalPayments(paymentRepository.count());
        summary.setTotalPlants(plantRepository.count());
        summary.setTotalCategories(categoryRepository.count());
        summary.setTotalFeedBacks(contactRepository.count());
        summary.setTotalKyc(kycRepository.count());
        summary.setTotalReview(reviewRepository.count());
        return summary;
    }


    public String sendPasswordResetOtp(String email) {
        var user = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        repo.save(user);

        EmailDetails details = new EmailDetails();
        details.setRecipient(user.getEmail());
        details.setSubject("OTP for Password Reset");
        details.setBody("<h2>Your OTP is: <strong>" + otp + "</strong></h2><p>It expires in 5 minutes.</p>");

        emailService.sendEmailAsync(details);

        return "OTP sent to your email address.";
    }



    public String verifyOtp(String email, String otp) {
        var user = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!otp.equals(user.getOtp()))
            throw new IllegalArgumentException("Invalid OTP");

        if (user.getOtpExpiry().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("OTP expired");

        user.setOtpVerified(true);
        repo.save(user);

        return "OTP verified successfully.";
    }



    public String resetPassword(String email, String newPassword, String confirmPassword) {
        var user = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getOtpVerified()))
            throw new IllegalArgumentException("OTP not verified");

        if (!newPassword.equals(confirmPassword))
            throw new IllegalArgumentException("Passwords do not match");

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpVerified(false); // Clear after reset
        repo.save(user);

        return "Password reset successfully.";
    }





}
