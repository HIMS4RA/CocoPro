package com.cocopro.backend.controller;

import com.cocopro.backend.model.Transaction;
import com.cocopro.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(service.filterByType(type));
        } else if (date != null) {
            return ResponseEntity.ok(service.filterBySingleDate(date));
        } else {
            return ResponseEntity.ok(service.getAll());
        }
    }

    @PostMapping
    public ResponseEntity<Transaction> add(@RequestBody @Valid Transaction tx) {
        return ResponseEntity.ok(service.add(tx));
    }

    @PutMapping("/{tid}")
    public ResponseEntity<Transaction> update(@PathVariable Long tid, @RequestBody @Valid Transaction updatedTx) {
        return ResponseEntity.ok(service.update(tid, updatedTx));
    }

    @DeleteMapping("/{tid}")
    public ResponseEntity<Void> delete(@PathVariable Long tid) {
        service.delete(tid);
        return ResponseEntity.noContent().build();
    }
}
