package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.request.LoginRequest;
import com.project.plant_nursery_management_system.dto.response.LoginResponse;
import com.project.plant_nursery_management_system.dto.request.RegisterUserRequest;
import com.project.plant_nursery_management_system.exception.ResourceNotFoundException;
import com.project.plant_nursery_management_system.model.onlyenums.Role;
import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.repository.UserRepository;
import com.project.plant_nursery_management_system.security.JwtUtil;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import com.project.plant_nursery_management_system.util.HtmlTemplateUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    private EmailService emailService;

    private HtmlTemplateUtil htmlTemplateUtil;


    public AuthService(UserRepository repo, BCryptPasswordEncoder encoder,
                       JwtUtil jwtUtil, EmailService emailService,
                       HtmlTemplateUtil htmlTemplateUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.htmlTemplateUtil = htmlTemplateUtil;
    }

    public void register(RegisterUserRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        Role role = req.getRole() != null ? req.getRole() : Role.ROLE_USER;

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(role);

        try {
            EmailDetails details = new EmailDetails();
            details.setRecipient(user.getEmail());
            details.setSubject("Welcome!");
            details.setTemplateName("registration-success.html");

            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("username", user.getName());

            String template = htmlTemplateUtil.loadTemplate(details.getTemplateName());
            String body = htmlTemplateUtil.replacePlaceholders(template, placeholders);
            details.setBody(body);

            emailService.sendEmailAsync(details);
        }catch (Exception e)
        {
            throw  new RuntimeException("Email Service not Working..");
        }

        repo.save(user);
    }

    public LoginResponse login(LoginRequest req) {
        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId()); // Ensure your token includes role
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new LoginResponse(token ,refreshToken);
    }
}
