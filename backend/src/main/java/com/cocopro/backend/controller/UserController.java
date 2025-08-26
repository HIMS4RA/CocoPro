package com.cocopro.backend.controller;

import com.cocopro.backend.model.OtpRequest;
import com.cocopro.backend.model.PasswordRequest;
import com.cocopro.backend.model.User;
import com.cocopro.backend.service.ForgotPasswordService;
import com.cocopro.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    /**
     * Add a new worker
     * @param user The user details
     * @return The saved worker
     */
    @PostMapping("/workers")
    public ResponseEntity<User> addWorker(@RequestBody User user) {
        User savedWorker = userService.addWorker(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWorker);
    }

    /**
     * Get all workers
     * @return List of all workers
     */
    @GetMapping("/workers")
    public ResponseEntity<List<User>> getAllWorkers() {
        List<User> workers = userService.getAllWorkers();
        return ResponseEntity.ok(workers);
    }

    /**
     * Send OTP for forgot password
     * @param payload Contains the email
     * @return Success or error message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String result = forgotPasswordService.sendOtp(email);
        if ("OTP sent".equals(result)) {
            return ResponseEntity.ok("OTP sent successfully to your email");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * Verify OTP
     * @param request Contains email and OTP
     * @return Success or error message
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody OtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        System.out.println(email);
        System.out.println(otp);

        if (forgotPasswordService.verifyOtp(email, otp)) {
            return ResponseEntity.ok("OTP verified successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
    }

    /**
     * Change password
     * @param passwordRequest Contains email and new password
     * @return Success or error message
     */
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordRequest passwordRequest) {
        String result = forgotPasswordService.resetPassword(passwordRequest.getEmail(), passwordRequest.getPassword());
        if ("Password reset successfully".equals(result)) {
            return ResponseEntity.ok("Password changed successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * Update current user's personal information
     * @param updatedUser The updated user details
     * @param session The HTTP session
     * @return Success or error message
     */
    @PutMapping("/user/update")
    public ResponseEntity<String> updateUser(@RequestBody User updatedUser, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            System.out.println("No user found in session");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        try {
            System.out.println("Updating user: " + currentUser.getId() + " with data: " + updatedUser);
            // Update only allowed fields
            currentUser.setFirstName(updatedUser.getFirstName());
            currentUser.setLastName(updatedUser.getLastName());
            currentUser.setEmail(updatedUser.getEmail());
            currentUser.setPhoneNumber(updatedUser.getPhoneNumber());
            currentUser.setRole(updatedUser.getRole());
            currentUser.setDepartment(updatedUser.getDepartment());
            currentUser.setBio(updatedUser.getBio());

            userService.updateUser(currentUser);
            System.out.println("User updated successfully: " + currentUser.getId());
            return ResponseEntity.ok("Personal information updated successfully");
        } catch (Exception e) {
            System.out.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update personal information: " + e.getMessage());
        }
    }

    @GetMapping("/getManagers")
    public ResponseEntity<List<User>> getWorkersByRole(@RequestParam(required = false) String role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllWorkers());
    }
}