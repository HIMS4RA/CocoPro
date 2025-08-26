package com.cocopro.backend.controller;

import com.cocopro.backend.model.RawMaterial;
import com.cocopro.backend.model.Supplier;
import com.cocopro.backend.repository.RawMaterialRepository;
import com.cocopro.backend.service.RawMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/raw-materials")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true",
        maxAge = 3600)
public class RawMaterialController {

    @Autowired
    private RawMaterialService rawMaterialService;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    @GetMapping
    public List<RawMaterial> getAllRawMaterials() {
        return rawMaterialService.allRawMaterials();
    }

    @GetMapping("/{id}")
    public RawMaterial getRawMaterial(@PathVariable int id) {
        return rawMaterialService.getRawMaterial(id);
    }

    @GetMapping("/low-stock")
    public List<RawMaterial> getLowStockMaterials() {
        return rawMaterialRepository.findLowStockMaterials()
                .stream()
                .sorted(Comparator.comparingDouble(m -> m.getThreshold() - m.getTotalQuantity()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public RawMaterial createRawMaterial(@RequestBody Map<String, Object> payload) {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setName((String) payload.get("name"));
        rawMaterial.setDescription((String) payload.get("description"));
        rawMaterial.setQuantity(Double.parseDouble(payload.get("quantity").toString()));
        rawMaterial.setUnit((String) payload.get("unit"));
        rawMaterial.setThreshold(payload.containsKey("threshold") ?
                Double.parseDouble(payload.get("threshold").toString()) : 0);
        rawMaterial.setCreatedAt(Date.valueOf((String) payload.get("createdAt")));

        Map<String, Object> supplierMap = (Map<String, Object>) payload.get("supplier");
        if (supplierMap != null && supplierMap.get("id") != null) {
            int supplierId = Integer.parseInt(supplierMap.get("id").toString());
            Supplier supplier = new Supplier();
            supplier.setId(supplierId);
            rawMaterial.setSupplier(supplier);
        }

        return rawMaterialService.saveRawMaterial(rawMaterial);
    }

    @PutMapping("/{id}/threshold")
    public RawMaterial updateReorderThreshold(@PathVariable int id, @RequestBody Map<String, Object> payload) {
        double newThreshold = Double.parseDouble(payload.get("threshold").toString());
        RawMaterial rawMaterial = rawMaterialService.getRawMaterial(id);

        if (rawMaterial != null) {
            rawMaterial.setThreshold(newThreshold);
            rawMaterialService.saveRawMaterial(rawMaterial);
            rawMaterialService.checkStockForReorder(rawMaterial);
        }

        return rawMaterial;
    }

    @DeleteMapping("/{id}")
    public void deleteRawMaterial(@PathVariable int id) {
        rawMaterialService.deleteRawMaterial(id);
    }

    @GetMapping("/daily-quantities")
    public List<Map<String, Object>> getDailyQuantities() {
        List<Object[]> data = rawMaterialService.getDailyQuantities();
        return data.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            String date = (obj[0] != null) ? obj[0].toString() : "Unknown Date";
            Double dailyAdded = (obj[1] != null) ? ((Number) obj[1]).doubleValue() : 0.0;
            Double currentStock = (obj[2] != null) ? ((Number) obj[2]).doubleValue() : 0.0;
            map.put("date", date);
            map.put("dailyAdded", dailyAdded);
            map.put("currentStock", currentStock);
            return map;
        }).collect(Collectors.toList());
    }
}