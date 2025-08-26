package com.cocopro.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Email(message = "Please provide a valid email address")
    @Column(unique = true)
    private String email;

    private String phoneNumber;
    private LocalDate joinDate;
    private String address;
    private String notes;
    private String password;
    private String role;
    private String department;
    private String bio;

    public User() {
    }

    public User(Long id, String firstName, String lastName, String email, String phoneNumber, String address,
                LocalDate joinDate, String notes, String password, String role, String department, String bio) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.joinDate = joinDate;
        this.notes = notes;
        this.password = password;
        this.role = role;
        this.department = department;
        this.bio = bio;
    }

    // Getters and Setters
    public void setId(Long id) { this.id = id; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
    public void setAddress(String address) { this.address = address; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setDepartment(String department) { this.department = department; }
    public void setBio(String bio) { this.bio = bio; }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
    public LocalDate getJoinDate() { return joinDate; }
    public String getNotes() { return notes; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
    public String getBio() { return bio; }

    // Alias methods for compatibility
    public String getContactNumber() { return phoneNumber; }
    public void setContactNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPhone() { return phoneNumber; }
    public void setPhone(String phone) { this.phoneNumber = phone; }

    public String getPosition() { return role; }
    public void setPosition(String position) { this.role = position; }

    // Placeholder for profile image (no storage in current schema)
    public String getProfileImage() { return null; }
    public void setProfileImage(String profileImage) { /* No-op: Add storage if needed */ }
}