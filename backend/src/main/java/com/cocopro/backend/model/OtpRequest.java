package com.cocopro.backend.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public class OtpRequest {

    @NotEmpty(message = "Email is required")
    @Pattern(regexp = ".+@.+\\..+", message = "Invalid email format")
    private String email;

    @NotEmpty(message = "OTP is required")
    private String otp;

    // Getter and Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
