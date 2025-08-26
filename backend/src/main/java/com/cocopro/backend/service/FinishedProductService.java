package com.cocopro.backend.service;

import com.cocopro.backend.repository.FinishedProductRepository;
import com.cocopro.backend.model.FinishedProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinishedProductService {

    @Autowired
    private FinishedProductRepository finishedProductRepository;

    // Get all finished products
    public List<FinishedProduct> allFinishedProducts() {
        return finishedProductRepository.findAll();
    }

    // Get a finished product by ID
    public FinishedProduct getFinishedProduct(int id) {
        return finishedProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Finished Product not found"));
    }

    // Save a finished product
    public FinishedProduct saveFinishedProduct(FinishedProduct finishedProduct) {
        //Auto-calculate quantityWasted before saving
        double wasted = finishedProduct.getQuantityUsed() - finishedProduct.getProducedQuantity();
        if (wasted < 0) wasted = 0; // protect against negative waste
        finishedProduct.setQuantityWasted(wasted);

        return finishedProductRepository.save(finishedProduct);
    }

    // Delete a finished product by ID
    public void deleteFinishedProduct(int id) {
        finishedProductRepository.deleteById(id);
    }

    // Get daily production data: date, quantity used, quantity wasted, produced quantity
    public List<Object[]> getDailyProduction() {
        return finishedProductRepository.findDailyProduction();
    }
}
