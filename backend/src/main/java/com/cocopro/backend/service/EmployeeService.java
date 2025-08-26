package com.cocopro.backend.service;

import com.cocopro.backend.model.Employee;
import com.cocopro.backend.model.Payroll;
import com.cocopro.backend.repository.EmployeeRepository;
import com.cocopro.backend.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PayrollService payrollService;
    private final PayrollRepository payrollRepository;


    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, PayrollService payrollService, PayrollRepository payrollRepository) {
        this.employeeRepository = employeeRepository;
        this.payrollService = payrollService;
        this.payrollRepository = payrollRepository;
    }

    public Employee addEmployee(Employee employee) {
        Employee savedEmployee = employeeRepository.save(employee);
        payrollService.calculatePayroll(savedEmployee); // Auto payroll generation
        return savedEmployee;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setRole(employeeDetails.getRole());
        employee.setHourlyRate(employeeDetails.getHourlyRate());
        employee.setOperationalHours(employeeDetails.getOperationalHours());

        Employee updatedEmployee = employeeRepository.save(employee);
        payrollService.calculatePayroll(updatedEmployee); // Recalculate payroll on update

        return updatedEmployee;
    }

    public void deleteEmployee(Long id) {
        Payroll payroll = payrollRepository.findByEmployeeId(id);

        if (payroll != null) {
            if ("NOT_PAID".equalsIgnoreCase(payroll.getPaymentStatus())) {
                throw new IllegalStateException("Cannot delete employee. Payroll not paid.");
            }
            // First delete payroll safely
            payrollRepository.delete(payroll);
        }

        // Now delete the employee after payroll deleted
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
        } else {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
    }



}
