// IssueReport.java
package com.cocopro.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class IssueReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    private String issueType; // "MACHINE_ERROR" or "LOW_STOCK"
    private String description;
    private String status = "PENDING"; // "PENDING", "IN_PROGRESS", "RESOLVED"
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "worker_name")
    private String workerName;

    public IssueReport(){

    }

    public IssueReport(Long id, User reporter, User manager, String issueType, String description, String status, LocalDateTime createdAt, String workerName) {
        this.id = id;
        this.reporter = reporter;
        this.manager = manager;
        this.issueType = issueType;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.workerName = workerName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getWorkerName() {
        return workerName;
    }

    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }
}