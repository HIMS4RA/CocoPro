package com.cocopro.backend.service;

import com.cocopro.backend.model.Transaction;
import com.cocopro.backend.model.Payroll;
import com.cocopro.backend.repository.TransactionRepository;
import com.cocopro.backend.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProfitLossService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    public Map<String, Object> generateProfitLoss(LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> incomeMap = new HashMap<>();
        Map<String, BigDecimal> expenseMap = new HashMap<>();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        // Fetch Transactions within the date range
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate);

        for (Transaction t : transactions) {
            if (t.getType().equalsIgnoreCase("INCOME")) {
                incomeMap.merge(t.getCategory(), t.getAmount(), BigDecimal::add);
                totalIncome = totalIncome.add(t.getAmount());
            } else if (t.getType().equalsIgnoreCase("EXPENSE")) {
                expenseMap.merge(t.getCategory(), t.getAmount(), BigDecimal::add);
                totalExpense = totalExpense.add(t.getAmount());
            }
        }

        // Fetch all Payroll records to calculate total Wages expense
        List<Payroll> payrolls = payrollRepository.findAll();
        for (Payroll p : payrolls) {
            expenseMap.merge("Wages", p.getNetSalary(), BigDecimal::add);
            totalExpense = totalExpense.add(p.getNetSalary());
        }

        // Prepare the result data
        Map<String, Object> result = new HashMap<>();
        result.put("incomeMap", incomeMap);
        result.put("expenseMap", expenseMap);
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("profitOrLoss", totalIncome.subtract(totalExpense));

        return result;
    }
}
