package com.cocopro.backend.repository;

import com.cocopro.backend.model.BatchCounter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchCounterRepository extends JpaRepository<BatchCounter, String> {
}