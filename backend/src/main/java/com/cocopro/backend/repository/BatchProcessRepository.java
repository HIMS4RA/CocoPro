package com.cocopro.backend.repository;

import com.cocopro.backend.model.BatchProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BatchProcessRepository extends JpaRepository<BatchProcess, Long> {
    BatchProcess findByBatchId(String batchId);
    List<BatchProcess> findAllByOrderByStartTimeDesc();
    List<BatchProcess> findTop10ByOrderByStartTimeDesc();
    List<BatchProcess> findByStartTimeBetweenOrderByStartTimeDesc(LocalDateTime start, LocalDateTime end);
    // New method to filter by userEmail and startTime
    List<BatchProcess> findByUserEmailAndStartTimeBetweenOrderByStartTimeDesc(String userEmail, LocalDateTime start, LocalDateTime end);
    List<BatchProcess> findByUserEmailOrderByStartTimeDesc(String userEmail);
}