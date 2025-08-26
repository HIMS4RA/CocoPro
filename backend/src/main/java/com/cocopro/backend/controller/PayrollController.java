package com.cocopro.backend.controller;

import com.cocopro.backend.model.Employee;
import com.cocopro.backend.model.Payroll;
import com.cocopro.backend.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    //GET all payrolls - for payroll list table
    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls(); // Fetching all payrolls from the service
    }

    //Calculate payroll (if needed)
    @PostMapping("/calculate/{employeeId}")
    public Payroll calculatePayroll(@PathVariable Long employeeId) {
        Employee employee = new Employee(); // You can replace this with actual logic if needed
        return payrollService.calculatePayroll(employee);
    }

    //Mark payroll as PAID
    @PutMapping("/mark-paid/{id}")
    public String markPayrollAsPaid(@PathVariable Long id) {
        Payroll payroll = payrollService.getPayrollById(id);
        if (payroll == null) {
            throw new RuntimeException("Payroll not found for ID: " + id);
        }
        payroll.setPaymentStatus("PAID");
        payrollService.save(payroll);
        return "Payment status updated to PAID for payroll ID: " + id;
    }
}
