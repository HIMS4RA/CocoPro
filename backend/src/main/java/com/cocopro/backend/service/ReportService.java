package com.cocopro.backend.service;

import com.cocopro.backend.repository.FinishedProductRepository;
import com.cocopro.backend.repository.RawMaterialRepository;
import com.cocopro.backend.model.FinishedProduct;
import com.cocopro.backend.model.RawMaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    @Autowired
    private FinishedProductRepository finishedProductRepository;

    // Fetch filtered raw materials by name
    public List<RawMaterial> getFilteredRawMaterials(String name) {
        if (name != null && !name.isEmpty()) {
            return rawMaterialRepository.findByNameContaining(name); // Filter by name
        }
        return rawMaterialRepository.findAll(); // Return all raw materials if no name filter
    }

    // Fetch filtered finished products by name
    public List<FinishedProduct> getFilteredFinishedProducts(String name) {
        if (name != null && !name.isEmpty()) {
            return finishedProductRepository.findByNameContaining(name); // Filter by name
        }
        return finishedProductRepository.findAll(); // Return all finished products if no name filter
    }

    // Generate the report
    public String generateReport(List<RawMaterial> rawMaterials, List<FinishedProduct> finishedProducts) {
        StringBuilder report = new StringBuilder();

        // --- Finished Products Section ---
        if (finishedProducts != null && !finishedProducts.isEmpty()) {
            report.append("Finished Products:\n");
            report.append("ID,Name,Description,Quantity,Unit\n");
            for (FinishedProduct product : finishedProducts) {
                report.append(product.getId()).append(",")
                        .append(product.getProductName()).append(",")
                        .append(product.getDescription()).append(",")
                        .append(product.getProducedQuantity()).append(",")
                        .append(product.getUnit()).append("\n");
            }
        }

        // --- Raw Materials Section ---
        if (rawMaterials != null && !rawMaterials.isEmpty()) {
            report.append("\nRaw Materials:\n");
            report.append("ID,Name,Description,Quantity,Unit\n");
            for (RawMaterial material : rawMaterials) {
                report.append(material.getId()).append(",")
                        .append(material.getName()).append(",")
                        .append(material.getDescription()).append(",")
                        .append(material.getQuantity()).append(",")
                        .append(material.getUnit()).append("\n");
            }
        }

        return report.toString();
    }

    // Method to send the report (Email functionality can be integrated here)
    private void sendReportByEmail(String report) {
        // Integrate email service to send the report (e.g., using JavaMailSender)
        System.out.println("Sending Report: \n" + report);
    }
}
