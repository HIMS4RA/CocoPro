package com.cocopro.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tid;

    @NotNull(message = "Date is required")
    private LocalDate date;  // ✅ Removed @FutureOrPresent

    @NotBlank(message = "Description is required")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Description should only contain letters and spaces")
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", inclusive = true, message = "Amount must be at least LKR 1.00")
    private BigDecimal amount;

    @NotBlank(message = "Transaction type is required")
    @Pattern(regexp = "INCOME|EXPENSE", message = "Type must be either INCOME or EXPENSE")
    private String type;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Category should only contain letters and spaces")
    private String category;
}
