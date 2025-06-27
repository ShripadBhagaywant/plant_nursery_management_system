package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {


    private  final JavaMailSender mailSender;


    private  final TaskExecutor emailExecutor;


    public EmailServiceImpl(JavaMailSender mailSender, TaskExecutor emailExecutor) {
        this.mailSender = mailSender;
        this.emailExecutor = emailExecutor;
    }

    @Override
    public void sendEmailAsync(EmailDetails details) {
        emailExecutor.execute(() -> {
            try {
                sendEmail(details);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
    }

    private void sendEmail(EmailDetails details) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(details.getRecipient());
        helper.setSubject(details.getSubject());
        helper.setText(details.getBody(), true);  // true means HTML enabled

        mailSender.send(message);
    }
}

