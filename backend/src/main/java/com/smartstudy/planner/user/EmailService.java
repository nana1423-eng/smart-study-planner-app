package com.smartstudy.planner.user;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    public EmailService(org.springframework.mail.javamail.JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("no-reply@smartstudyplanner.com");
            message.setTo(toEmail);
            message.setSubject("Verify your Smart Study Planner Account");
            message.setText("Welcome! Your 6-digit verification code is: " + otpCode);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
