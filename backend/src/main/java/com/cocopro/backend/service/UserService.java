package com.cocopro.backend.service;

import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Add a new worker with a generated password and send a welcome email
     * @param worker The worker to add
     * @return The saved worker
     */
    public User addWorker(User worker) {
        String generatedPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(generatedPassword);
        worker.setPassword(encodedPassword);

        User savedWorker = userRepository.save(worker);

        sendWelcomeEmail(worker.getEmail(), generatedPassword);
        return savedWorker;
    }

    /**
     * Update an existing user's details
     * @param user The user with updated details
     * @return The updated user
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Get all workers
     * @return List of all workers
     */
    public List<User> getAllWorkers() {
        return userRepository.findAll();
    }

    /**
     * Generate a random 8-character password
     * @return The generated password
     */
    private String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Send a welcome email with account details
     * @param email The recipient's email
     * @param password The generated password
     */
    private void sendWelcomeEmail(String email, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Account Details");
        message.setText("Welcome! Your account has been created.\n\n" +
                "Username: " + email + "\n" +
                "Password: " + password + "\n\n" +
                "Please change your password upon first login.");
        mailSender.send(message);

        System.out.println("Mail sent successfully");
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
}