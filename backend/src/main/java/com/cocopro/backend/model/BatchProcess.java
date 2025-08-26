package com.cocopro.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_processes")
public class BatchProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_id", nullable = false, unique = true)
    private String batchId;

    @Column(name = "user_email")
    private String userEmail;


    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "initial_moisture", nullable = false)
    private Double initialMoisture;

    @Column(name = "final_moisture")
    private Double finalMoisture;

    // Constructors, getters, and setters
    public BatchProcess() {}

    public BatchProcess(String batchId, LocalDateTime startTime, Double initialMoisture) {
        this.batchId = batchId;
        this.startTime = startTime;
        this.initialMoisture = initialMoisture;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Double getFinalMoisture() {
        return finalMoisture;
    }

    public void setFinalMoisture(Double finalMoisture) {
        this.finalMoisture = finalMoisture;
    }

    public Double getInitialMoisture() {
        return initialMoisture;
    }

    public void setInitialMoisture(Double initialMoisture) {
        this.initialMoisture = initialMoisture;
    }
}