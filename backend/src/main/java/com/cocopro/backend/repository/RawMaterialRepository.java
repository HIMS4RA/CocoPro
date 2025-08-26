package com.cocopro.backend.repository;

import com.cocopro.backend.model.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Integer> {

    // Query to get daily added quantity and current available stock
    @Query("SELECT r.createdAt, SUM(r.quantity), SUM(r.totalQuantity) FROM RawMaterial r GROUP BY r.createdAt ORDER BY r.createdAt")
    List<Object[]> findDailyQuantities();

    // Query to find raw materials that are below the reorder threshold
    @Query("SELECT r FROM RawMaterial r WHERE r.totalQuantity < r.threshold")
    List<RawMaterial> findLowStockMaterials();

    // New query to filter raw materials by name (using LIKE for partial matching)
    @Query("SELECT r FROM RawMaterial r WHERE r.name LIKE %:name%")
    List<RawMaterial> findByNameContaining(String name);  // Filters raw materials based on name
}
