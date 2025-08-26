package com.cocopro.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Role is required")
    @Pattern(
            regexp = "WORKER|SUPERVISOR|MANAGER|OWNER",
            message = "Role must be one of WORKER, SUPERVISOR, MANAGER, OWNER"
    )
    private String role;

    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Hourly rate must be a valid monetary amount")
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;


    @NotNull(message = "Operational hours are required")
    @Min(value = 1, message = "Operational hours must be at least 1")
    @Max(value = 168, message = "Operational hours cannot exceed 168 (1 week)")
    private Integer operationalHours;

    // === Getters and Setters ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }


    public Integer getOperationalHours() {
        return operationalHours;
    }

    public void setOperationalHours(Integer operationalHours) {
        this.operationalHours = operationalHours;
    }
}
