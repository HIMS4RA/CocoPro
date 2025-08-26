package com.cocopro.backend.service;


import com.cocopro.backend.model.Transaction;
import com.cocopro.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> getAll() {
        return repository.findAll();
    }

    public Transaction add(Transaction tx) {
        return repository.save(tx);
    }

    public Transaction update(Long tid, Transaction updated) {
        Transaction existing = repository.findById(tid)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + tid));

        existing.setDate(updated.getDate());
        existing.setDescription(updated.getDescription());
        existing.setAmount(updated.getAmount());
        existing.setType(updated.getType());
        existing.setCategory(updated.getCategory());

        return repository.save(existing);
    }

    public List<Transaction> filterBySingleDate(LocalDate date) {
        return repository.findByDate(date);
    }

    public void delete(Long tid) {
        if (!repository.existsById(tid)) {
            throw new RuntimeException("Transaction not found with ID: " + tid);
        }
        repository.deleteById(tid);
    }

    public List<Transaction> filterByDate(LocalDate start, LocalDate end) {
        return repository.findByDateBetween(start, end);
    }

    public List<Transaction> filterByCategory(String category) {
        return repository.findByCategory(category);
    }

    public List<Transaction> filterByType(String type) {
        return repository.findByType(type);
    }
}
