package com.cocopro.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class BatchCounter {
    @Id
    private String id = "BATCH_COUNTER"; // Single row ID
    private int lastBatchNumber;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getLastBatchNumber() {
        return lastBatchNumber;
    }

    public void setLastBatchNumber(int lastBatchNumber) {
        this.lastBatchNumber = lastBatchNumber;
    }
}