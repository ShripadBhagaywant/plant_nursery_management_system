package com.project.plant_nursery_management_system.security;

import com.project.plant_nursery_management_system.model.User;
import com.project.plant_nursery_management_system.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class BlockedUserInterceptor implements HandlerInterceptor {

    private UserRepository userRepository;

    public BlockedUserInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        if (method.equalsIgnoreCase("GET")) {
            return true; // Allow read-only
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.isBlocked()) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Blocked users can only perform read-only operations.");
                return false;
            }
        }
        return true;
    }

}
