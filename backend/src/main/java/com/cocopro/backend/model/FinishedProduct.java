package com.cocopro.backend.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class FinishedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String productName;        // Name of the finished product
    private String description;
    private double quantityUsed;       // Raw materials used
    private double quantityWasted;     // Raw materials wasted
    private double producedQuantity;   // Finished product quantity (NEW field)
    private String unit;               // Unit (kg, liters, etc.)
    private Date createdAt;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(double quantityUsed) {
        this.quantityUsed = quantityUsed;
    }

    public double getQuantityWasted() {
        return quantityWasted;
    }

    public void setQuantityWasted(double quantityWasted) {
        this.quantityWasted = quantityWasted;
    }

    public double getProducedQuantity() {
        return producedQuantity;
    }

    public void setProducedQuantity(double producedQuantity) {
        this.producedQuantity = producedQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
