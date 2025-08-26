package com.cocopro.backend.service;

import com.cocopro.backend.repository.SupplierRepository;
import com.cocopro.backend.model.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    // Get all suppliers
    public List<Supplier> allSuppliers() {
        return supplierRepository.findAll();
    }

    // Get a supplier by ID
    public Supplier getSupplier(int id) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        if (supplier.isPresent()) {
            return supplier.get();
        } else {
            throw new RuntimeException("Supplier not found");
        }
    }

    // Save a new supplier
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Delete a supplier by ID
    public void deleteSupplier(int id) {
        supplierRepository.deleteById(id);
    }

    public Supplier updateSupplier(Supplier supplier) {
        return supplierRepository.save(supplier); // this works for both create + update in JPA
    }

}
