package com.cocopro.backend.service;

import com.cocopro.backend.model.RawMaterial;
import org.springframework.stereotype.Service;

@Service
public class StockNotificationService {

    // Trigger the reorder alert and log the message
    public String sendReorderNotification(RawMaterial rawMaterial) {
        // Log the reorder alert for debugging purposes
        System.out.println("Reorder Alert: Stock for Raw Materials is below the threshold!");
        System.out.println("Current stock: " + rawMaterial.getTotalQuantity() + " | Threshold: " + rawMaterial.getThreshold());

        // Return the alert message to be sent in the API response
        return "Reorder Alert: Stock for Raw Materials is below the threshold! Current stock: " + rawMaterial.getTotalQuantity() + " | Threshold: " + rawMaterial.getThreshold();
    }
}
