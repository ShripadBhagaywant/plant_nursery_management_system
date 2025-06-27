package com.project.plant_nursery_management_system.config;

import com.project.plant_nursery_management_system.security.BlockedUserInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;


    private BlockedUserInterceptor blockedUserInterceptor;

    public WebMvcConfig(BlockedUserInterceptor blockedUserInterceptor) {
        this.blockedUserInterceptor = blockedUserInterceptor;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Normalize Windows paths (convert \ to /)
        String normalizedPath = uploadDir.replace("\\", "/");

        // Ensure trailing slash and proper file protocol
        if (!normalizedPath.endsWith("/")) {
            normalizedPath += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + normalizedPath);
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(blockedUserInterceptor);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }

}
