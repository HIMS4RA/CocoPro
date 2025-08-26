package com.cocopro.backend.repository;

import com.cocopro.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByDate(LocalDate date); //  Find transactions on a specific date

    List<Transaction> findByDateBetween(LocalDate start, LocalDate end); //  Find transactions between two dates

    List<Transaction> findByCategory(String category); // Find by category (like "Sales", "Supplies")

    List<Transaction> findByType(String type); // Find by type (INCOME / EXPENSE)
}
