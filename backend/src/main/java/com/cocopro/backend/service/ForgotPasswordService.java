package com.cocopro.backend.service;

import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Temporary storage for OTP (use a cache or database in a real-world scenario)
    private static final Map<String, String> OTP_CACHE = new HashMap<>();

    public String sendOtp(String email) {
        System.out.println(email);
        if (!userRepository.existsByEmail(email)) {
            return "Email not found";
        }

        String otp = generateOtp();
        storeOtpInCache(email, otp);
        sendOtpEmail(email, otp);

        return "OTP sent";
    }

    private String generateOtp() {
        Random rand = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(rand.nextInt(10)); // Generate a 6-digit OTP
        }
        return otp.toString();
    }

    private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP for Password Reset");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }

    private void storeOtpInCache(String email, String otp) {

        OTP_CACHE.put(email, otp); // Ensure you are storing the OTP correctly
        // Store OTP and email association temporarily in cache (use Redis, database, or similar)
        // This is a simple placeholder for demonstration purposes
        System.out.println("OTP stored for " + email + ": " + otp);
    }

    public boolean verifyOtp(String email, String otp) {

        // Trim spaces to ensure no mismatches due to leading/trailing spaces
        email = email.trim();
        otp = otp.trim();

        System.out.println("Verifying OTP for email: " + email);
        System.out.println("Received OTP: " + otp);

        System.out.println("Current OTPs in cache: " + OTP_CACHE); // Print OTP cache

        // Check if the OTP exists for the given email
        if (OTP_CACHE.containsKey(email) && OTP_CACHE.get(email).equals(otp)) {
            // OTP is valid, proceed to password reset or further actions
            OTP_CACHE.remove(email); // Optional: Remove OTP after successful verification
            return true;
        }
        return false; // Invalid OTP
    }

    private String getOtpFromCache(String email) {
        // Retrieve OTP from cache (placeholder logic)
        // This should use a cache like Redis for real-world scenarios
        return "storedOtp"; // Replace with actual logic
    }

    public String resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {

            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userRepository.save(user);
            return "Password reset successfully";
        }
        return "User not found";
    }
}
