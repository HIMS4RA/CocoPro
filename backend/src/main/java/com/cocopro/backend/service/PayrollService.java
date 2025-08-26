package com.cocopro.backend.service;

import com.cocopro.backend.model.Employee;
import com.cocopro.backend.model.Payroll;
import com.cocopro.backend.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    // 1. Create or update payroll
    public Payroll calculatePayroll(Employee employee) {
        Payroll payroll = payrollRepository.findByEmployeeId(employee.getId());

        if (payroll == null) {
            payroll = new Payroll();
            payroll.setEmployee(employee);
            payroll.setPaymentStatus("NOT_PAID"); // Default
        }

        // Step 1: Weekly salary
        BigDecimal weeklySalary = employee.getHourlyRate()
                .multiply(BigDecimal.valueOf(employee.getOperationalHours()));

        // Step 2: Basic salary
        BigDecimal basicSalary = weeklySalary.multiply(BigDecimal.valueOf(4)).setScale(2, RoundingMode.HALF_UP);
        payroll.setBasicSalary(basicSalary);

        // Step 3: Allowance
        BigDecimal allowances = BigDecimal.valueOf(5000);  // Example allowance value
        payroll.setAllowances(allowances);

        // Step 4: Calculate OT if working hours are more than 40
        BigDecimal overtimePay = BigDecimal.ZERO;
        if (employee.getOperationalHours() > 40) {
            // OT Calculation: 1.5x hourly rate for each hour over 40 hours
            BigDecimal overtimeRate = employee.getHourlyRate().multiply(BigDecimal.valueOf(1.5));
            BigDecimal overtimeHours = BigDecimal.valueOf(employee.getOperationalHours() - 40);
            overtimePay = overtimeRate.multiply(overtimeHours);
        }
        // Add overtime to allowances (do not overwrite)
        payroll.setAllowances(allowances.add(overtimePay));

        // Step 5: Deductions
        BigDecimal epf8 = basicSalary.multiply(BigDecimal.valueOf(0.08)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal epf12 = basicSalary.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal etf3 = basicSalary.multiply(BigDecimal.valueOf(0.03)).setScale(2, RoundingMode.HALF_UP);
        payroll.setEpf8(epf8);
        payroll.setEpf12(epf12);
        payroll.setEtf3(etf3);

        // Step 6: Final amounts
        BigDecimal grossSalary = basicSalary.add(allowances);
        BigDecimal totalDeductions = epf8.add(epf12).add(etf3);
        BigDecimal netSalary = grossSalary.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);

        payroll.setGrossSalary(grossSalary);
        payroll.setTotalDeductions(totalDeductions);
        payroll.setNetSalary(netSalary);
        payroll.setTotalSalary(grossSalary.subtract(totalDeductions)); // Store the net salary after deductions

        // Save and return the calculated payroll
        return payrollRepository.save(payroll);
    }

    // 2. Get all payrolls (for payroll list table)
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    // 3. Get payroll by employee ID (for payroll detail view)
    public Payroll getPayrollByEmployeeId(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    // 4. Get payroll by payroll ID (for Stripe payment session)
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with ID: " + id));
    }

    public Payroll save(Payroll payroll) {
        return payrollRepository.save(payroll);
    }
}
