package com.cocopro.backend.controller;

import com.cocopro.backend.service.FinishedProductService;
import com.cocopro.backend.service.RawMaterialService;
import com.cocopro.backend.model.FinishedProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/finished-products")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true",
        maxAge = 3600)
public class FinishedProductController {

    @Autowired
    private FinishedProductService finishedProductService;

    @Autowired
    private RawMaterialService rawMaterialService;

    // Get all finished products
    @GetMapping("/get")
    public List<FinishedProduct> getAllFinishedProducts() {
        return finishedProductService.allFinishedProducts();
    }

    // Get a specific finished product by ID
    @GetMapping("/{id}")
    public FinishedProduct getFinishedProduct(@PathVariable int id) {
        return finishedProductService.getFinishedProduct(id);
    }

    // Create a new finished product and deduct raw material stock
    @PostMapping("/add")
    public FinishedProduct createFinishedProduct(@RequestBody FinishedProduct finishedProduct) {
        //  First auto-calculate quantityWasted (already done inside service)
        FinishedProduct savedProduct = finishedProductService.saveFinishedProduct(finishedProduct);

        //  Now use quantityUsed + quantityWasted for deduction
        double totalRequired = savedProduct.getQuantityUsed() + savedProduct.getQuantityWasted();

        boolean deducted = rawMaterialService.deductRawMaterials(totalRequired);

        if (!deducted) {
            throw new RuntimeException("Not enough raw material stock to create this finished product.");
        }

        return savedProduct;
    }

    // Delete a finished product by ID
    @DeleteMapping("/{id}")
    public void deleteFinishedProduct(@PathVariable int id) {
        finishedProductService.deleteFinishedProduct(id);
    }

    // Get daily production data (used, wasted, produced)
    @GetMapping("/daily-production")
    public List<Map<String, Object>> getDailyProduction() {
        List<Object[]> data = finishedProductService.getDailyProduction();
        return data.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            String date = (obj[0] != null) ? obj[0].toString() : "Unknown Date";
            Double quantityUsed = (obj[1] != null) ? ((Number) obj[1]).doubleValue() : 0.0;
            Double quantityWasted = (obj[2] != null) ? ((Number) obj[2]).doubleValue() : 0.0;
            Double producedQuantity = (obj[3] != null) ? ((Number) obj[3]).doubleValue() : 0.0;

            map.put("date", date);
            map.put("quantityUsed", quantityUsed);
            map.put("quantityWasted", quantityWasted);
            map.put("producedQuantity", producedQuantity);
            return map;
        }).collect(Collectors.toList());
    }
}
