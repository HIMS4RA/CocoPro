package com.cocopro.backend.service;

import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private HttpSession session;

    private Set<Long> loggedInUsers = new HashSet<>();

    public ResponseEntity<?> signup(User user) {
        try {
            // Hash the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Don't return password
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during signup: " + e.getMessage());
        }
    }

    public ResponseEntity<?> login(User user) {
        User foundUser = userRepository.findByEmail(user.getEmail())
            .orElse(null);

        if (foundUser != null && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            foundUser.setPassword(null); // Don't send password back
            session.setAttribute("user", foundUser);
            loggedInUsers.add(foundUser.getId());
            return ResponseEntity.ok(foundUser);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    public ResponseEntity<?> logout() {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            loggedInUsers.remove(user.getId());
        }
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    public ResponseEntity<?> getCurrentUser() {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            // Fetch fresh data from database
            User currentUser = userRepository.findById(user.getId())
                .orElse(null);
            if (currentUser != null) {
                currentUser.setPassword(null);
                return ResponseEntity.ok(currentUser);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
} 