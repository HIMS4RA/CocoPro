package com.cocopro.backend.controller;

import com.cocopro.backend.service.ProfitLossService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class FinanceReportController {

    @Autowired
    private ProfitLossService profitLossService;

    @GetMapping("/profit-loss")
    public ResponseEntity<Map<String, Object>> getProfitLossReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // Generate Profit & Loss data
        Map<String, Object> report = profitLossService.generateProfitLoss(startDate, endDate);
        return ResponseEntity.ok(report);
    }
}
