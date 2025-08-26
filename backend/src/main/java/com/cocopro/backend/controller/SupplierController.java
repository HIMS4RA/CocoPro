package com.cocopro.backend.controller;

import com.cocopro.backend.service.SupplierService;
import com.cocopro.backend.model.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true",
        maxAge = 3600)
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // Get all suppliers
    @GetMapping("/get")
    public List<Supplier> getAllSuppliers() {
        return supplierService.allSuppliers();
    }

    // Get a specific supplier by ID
    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable int id) {
        return supplierService.getSupplier(id);
    }

    // Create a new supplier
    @PostMapping("/add")
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierService.saveSupplier(supplier);
    }

    // Delete a supplier by ID
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable int id) {
        supplierService.deleteSupplier(id);
    }

    // Update an existing supplier
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable int id, @RequestBody Supplier updatedSupplier) {
        updatedSupplier.setId(id); // Set the correct ID
        return supplierService.updateSupplier(updatedSupplier); // Make sure this exists in your service
    }



}
