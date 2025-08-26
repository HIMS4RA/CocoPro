package com.cocopro.backend.service;

import com.cocopro.backend.model.RawMaterial;
import com.cocopro.backend.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RawMaterialService {

    @Autowired
    private RawMaterialRepository repository;  // Repository for raw materials

    @Autowired
    private StockNotificationService stockNotificationService;  // Service for reorder alerts

    // Get all raw materials
    public List<RawMaterial> allRawMaterials() {
        return repository.findAll();  // Returns all raw materials from the database
    }

    // Get a specific raw material by ID
    public RawMaterial getRawMaterial(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));  // If not found, throw exception
    }

    // Save a new raw material (and update total stock)
    public RawMaterial saveRawMaterial(RawMaterial rawMaterial) {
        // If it's the first time creating, set totalQuantity = quantity
        if (rawMaterial.getTotalQuantity() == 0) {
            rawMaterial.setTotalQuantity(rawMaterial.getQuantity());  // First-time creation, use provided quantity
        } else {
            // Normally totalQuantity = previous total + today's quantity
            rawMaterial.setTotalQuantity(rawMaterial.getTotalQuantity() + rawMaterial.getQuantity());
        }

        // Save the raw material to the database
        RawMaterial savedMaterial = repository.save(rawMaterial);

        // After saving, check if stock falls below threshold
        checkStockForReorder(savedMaterial);

        return savedMaterial;
    }

    // Check if any raw material stock falls below the reorder threshold
    public void checkStockForReorder(RawMaterial rawMaterial) {
        if (rawMaterial.getTotalQuantity() < rawMaterial.getThreshold()) {
            // Send reorder notification if stock is below threshold
            stockNotificationService.sendReorderNotification(rawMaterial);  // Notify if reorder is needed
        }
    }

    // Delete a raw material by ID
    public void deleteRawMaterial(int id) {
        repository.deleteById(id);  // Delete raw material from the database by ID
    }

    // Get daily quantities (for reporting)
    public List<Object[]> getDailyQuantities() {
        return repository.findDailyQuantities();  // Custom query to get daily quantities (this should be implemented in your repository)
    }

    // Deduct raw materials globally when creating a finished product
    public boolean deductRawMaterials(double totalRequired) {
        // Get all raw materials from the repository
        List<RawMaterial> materials = repository.findAll();

        // Sort materials by createdAt (FIFO - oldest stock first)
        materials = materials.stream()
                .filter(m -> m.getTotalQuantity() > 0)  // Only consider materials with available stock
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))  // FIFO (First In, First Out) logic
                .collect(Collectors.toList());

        // Check if available stock is sufficient
        double availableStock = materials.stream()
                .mapToDouble(RawMaterial::getTotalQuantity)
                .sum();

        if (availableStock < totalRequired) {
            return false;  // Not enough stock to fulfill the requirement
        }

        // Deduct the required raw materials from stock
        double remainingToDeduct = totalRequired;

        for (RawMaterial material : materials) {
            if (remainingToDeduct <= 0) break;

            double available = material.getTotalQuantity();

            // If the material has enough stock, deduct from it
            if (available >= remainingToDeduct) {
                material.setTotalQuantity(available - remainingToDeduct);  // Deduct stock
                repository.save(material);  // Save updated material
                remainingToDeduct = 0;
            } else {
                // Deduct the whole stock if it's less than the required amount
                remainingToDeduct -= available;
                material.setTotalQuantity(0);  // Set stock to zero
                repository.save(material);  // Save updated material
            }
        }

        return true;  // Successfully deducted the required materials
    }
}
