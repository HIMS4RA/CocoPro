package com.cocopro.backend.controller;

import com.cocopro.backend.model.BatchProcess;
import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.BatchProcessRepository;
import com.cocopro.backend.service.BatchProcessService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/batch-processes")
public class BatchProcessController {
    private final BatchProcessService batchProcessService;

    @Autowired
    private BatchProcessRepository batchProcessRepository;

    public BatchProcessController(BatchProcessService batchProcessService) {
        this.batchProcessService = batchProcessService;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startBatchProcess(
            @RequestParam double initialMoisture,
            @RequestParam(required = false) String userEmail,
            HttpSession session) {

        System.out.println("Start batch request received");

        if (userEmail == null) {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            userEmail = user.getEmail();
        }

        BatchProcess batchProcess = batchProcessService.startBatchProcess(
                initialMoisture,
                userEmail);

        Map<String, String> response = new HashMap<>();
        response.put("batchId", batchProcess.getBatchId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stop")
    public ResponseEntity<BatchProcess> stopBatchProcess(
            @RequestParam String batchId,
            @RequestParam double finalMoisture,
            HttpSession session) {

        System.out.println("Stop batch request received");
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BatchProcess batchProcess = batchProcessRepository.findByBatchId(batchId);
        if (batchProcess == null) {
            return ResponseEntity.notFound().build();
        }

        batchProcess.setEndTime(LocalDateTime.now());
        batchProcess.setFinalMoisture(finalMoisture);
        batchProcess = batchProcessRepository.save(batchProcess);

        return ResponseEntity.ok(batchProcess);
    }

    @GetMapping("/getBatches")
    public ResponseEntity<List<BatchProcess>> getAllBatchProcesses(
            @RequestParam String userEmail,
            HttpSession session) {
        // Verify user session
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getEmail().equals(userEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<BatchProcess> batches = batchProcessService.getAllBatchProcessesByUser(userEmail);
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/getLast10Batches")
    public ResponseEntity<List<BatchProcess>> getLast10BatchProcesses() {
        List<BatchProcess> batches = batchProcessService.getLast10BatchProcesses();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/getTodayBatches")
    public ResponseEntity<List<BatchProcess>> getTodayBatches(
            @RequestParam String userEmail,
            HttpSession session) {
        // Verify user session
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getEmail().equals(userEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<BatchProcess> batches = batchProcessService.getTodayBatches(userEmail);
        return ResponseEntity.ok(batches);
    }
}