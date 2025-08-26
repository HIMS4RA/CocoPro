package com.cocopro.backend.service;

import com.cocopro.backend.model.BatchCounter;
import com.cocopro.backend.model.BatchProcess;
import com.cocopro.backend.repository.BatchCounterRepository;
import com.cocopro.backend.repository.BatchProcessRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BatchProcessService {
    private final BatchProcessRepository batchProcessRepository;
    private final BatchCounterRepository batchCounterRepository;
    private int currentBatchNumber;

    public BatchProcessService(BatchProcessRepository batchProcessRepository, BatchCounterRepository batchCounterRepository) {
        this.batchProcessRepository = batchProcessRepository;
        this.batchCounterRepository = batchCounterRepository;
    }

    @PostConstruct
    public void init() {
        Optional<BatchCounter> counter = batchCounterRepository.findById("BATCH_COUNTER");
        currentBatchNumber = counter.map(BatchCounter::getLastBatchNumber).orElse(0);
    }

    @Transactional
    public BatchProcess startBatchProcess(Double initialMoisture, String userEmail) {
        currentBatchNumber++;
        String batchId = generateBatchId();
        LocalDateTime startTime = LocalDateTime.now();

        BatchCounter counter = batchCounterRepository.findById("BATCH_COUNTER")
                .orElse(new BatchCounter());
        counter.setLastBatchNumber(currentBatchNumber);
        batchCounterRepository.save(counter);

        BatchProcess batchProcess = new BatchProcess(batchId, startTime, initialMoisture);
        batchProcess.setUserEmail(userEmail);
        return batchProcessRepository.save(batchProcess);
    }

    public BatchProcess stopBatchProcess(String batchId, Double finalMoisture) {
        BatchProcess batchProcess = batchProcessRepository.findByBatchId(batchId);
        if (batchProcess == null) {
            throw new RuntimeException("Batch process not found");
        }

        batchProcess.setEndTime(LocalDateTime.now());
        batchProcess.setFinalMoisture(finalMoisture);
        return batchProcessRepository.save(batchProcess);
    }

    private String generateBatchId() {
        return "B" + currentBatchNumber;
    }

    public List<BatchProcess> getAllBatchProcesses() {
        return batchProcessRepository.findAllByOrderByStartTimeDesc();
    }

    public List<BatchProcess> getAllBatchProcessesByUser(String userEmail) {
        return batchProcessRepository.findByUserEmailOrderByStartTimeDesc(userEmail);
    }

    public List<BatchProcess> getLast10BatchProcesses() {
        return batchProcessRepository.findTop10ByOrderByStartTimeDesc();
    }

    // Updated method to filter by userEmail
    public List<BatchProcess> getTodayBatches(String userEmail) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        return batchProcessRepository
                .findByUserEmailAndStartTimeBetweenOrderByStartTimeDesc(userEmail, startOfDay, endOfDay)
                .stream()
                .limit(10)
                .collect(Collectors.toList());
    }
}