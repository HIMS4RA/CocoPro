package com.cocopro.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate assignedDate;
    
    @FutureOrPresent(message = "Deadline must be today or in the future")
    private LocalDate deadline;
    
    private String status; // pending, in-progress, completed
    private String priority; // low, medium, high

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private User worker;

    @ManyToOne
    @JoinColumn(name = "supervisor_id")
    private User supervisor;

    public Task() {
        this.assignedDate = LocalDate.now();
        this.status = "pending";
    }
}