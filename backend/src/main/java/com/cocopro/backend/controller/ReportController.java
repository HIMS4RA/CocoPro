package com.cocopro.backend.controller;

import com.cocopro.backend.model.FinishedProduct;
import com.cocopro.backend.model.RawMaterial;
import com.cocopro.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173", // Your frontend origin
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true",
        maxAge = 3600)
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Updated getReport method to filter by name instead of date
    @GetMapping("/api/reports")
    public ResponseEntity<byte[]> getReport(
            @RequestParam(required = false) String name,  // Change from 'date' to 'name'
            @RequestParam(required = false, defaultValue = "both") String filterType) throws Exception {

        // Get the filtered list of raw materials and finished products based on name
        List<RawMaterial> rawMaterials = null;
        List<FinishedProduct> finishedProducts = null;

        if ("both".equals(filterType) || "raw-materials".equals(filterType)) {
            rawMaterials = reportService.getFilteredRawMaterials(name);  // Fetch raw materials by name
        }

        if ("both".equals(filterType) || "finished-products".equals(filterType)) {
            finishedProducts = reportService.getFilteredFinishedProducts(name);  // Fetch finished products by name
        }

        // Generate the report with the filtered data
        String reportData = reportService.generateReport(rawMaterials, finishedProducts);

        // Convert the report data (String) to a byte array
        byte[] reportBytes = reportData.getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=inventory_report.csv");

        return new ResponseEntity<>(reportBytes, headers, HttpStatus.OK);
    }
}
