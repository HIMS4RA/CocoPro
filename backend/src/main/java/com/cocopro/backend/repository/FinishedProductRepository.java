package com.cocopro.backend.repository;

import com.cocopro.backend.model.FinishedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FinishedProductRepository extends JpaRepository<FinishedProduct, Integer> {

    // Query to get daily quantity used, wasted, and produced (unchanged)
    @Query("SELECT CAST(f.createdAt AS date), SUM(f.quantityUsed), SUM(f.quantityWasted), SUM(f.producedQuantity) FROM FinishedProduct f GROUP BY CAST(f.createdAt AS date) ORDER BY CAST(f.createdAt AS date)")
    List<Object[]> findDailyProduction();

    // New query to filter finished products by name (using LIKE for partial matching)
    @Query("SELECT f FROM FinishedProduct f WHERE f.productName LIKE %:name%")
    List<FinishedProduct> findByNameContaining(String name);  // Filters finished products based on name
}
