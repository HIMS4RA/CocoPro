package com.cocopro.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @Column(precision = 10, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal allowances;

    @Column(precision = 10, scale = 2)
    private BigDecimal epf8;

    @Column(precision = 10, scale = 2)
    private BigDecimal epf12;

    @Column(precision = 10, scale = 2)
    private BigDecimal etf3;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal grossSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalDeductions;

    @Column(nullable = false)
    private String paymentStatus = "NOT_PAID"; // Default value

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public BigDecimal getBasicSalary() { return basicSalary; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getEpf8() { return epf8; }
    public void setEpf8(BigDecimal epf8) { this.epf8 = epf8; }

    public BigDecimal getEpf12() { return epf12; }
    public void setEpf12(BigDecimal epf12) { this.epf12 = epf12; }

    public BigDecimal getEtf3() { return etf3; }
    public void setEtf3(BigDecimal etf3) { this.etf3 = etf3; }

    public BigDecimal getTotalSalary() { return totalSalary; }
    public void setTotalSalary(BigDecimal totalSalary) { this.totalSalary = totalSalary; }

    public BigDecimal getGrossSalary() { return grossSalary; }
    public void setGrossSalary(BigDecimal grossSalary) { this.grossSalary = grossSalary; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }

    public BigDecimal getTotalDeductions() { return totalDeductions; }
    public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
