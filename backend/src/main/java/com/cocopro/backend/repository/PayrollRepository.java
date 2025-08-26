package com.cocopro.backend.repository;

import com.cocopro.backend.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Payroll findByEmployeeId(Long employeeId);
}
