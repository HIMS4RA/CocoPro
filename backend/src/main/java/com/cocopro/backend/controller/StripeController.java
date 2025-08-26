package com.cocopro.backend.controller;

import com.cocopro.backend.dto.StripeResponse;
import com.cocopro.backend.model.Payroll;
import com.cocopro.backend.service.PayrollService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/stripe")
public class StripeController {

    @Value("${stripe.secretKey}")
    private String stripeSecretKey;

    private final PayrollService payrollService;

    public StripeController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    /**
     * This endpoint creates a Stripe session for payment.
     * It includes overtime pay (if applicable) and calculates the total salary.
     *
     * @param payrollId - The payroll ID for the employee
     * @return StripeResponse with the session URL
     */
    @PostMapping("/pay/{payrollId}")
    public ResponseEntity<StripeResponse> createStripeSession(@PathVariable Long payrollId) {
        Payroll payroll = payrollService.getPayrollById(payrollId);

        if (payroll == null || "PAID".equalsIgnoreCase(payroll.getPaymentStatus())) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Calculate the total amount (netSalary + any overtime)
            BigDecimal overtimeAmount = calculateOvertime(payroll);
            long amountInCents = payroll.getNetSalary().add(overtimeAmount)
                    .multiply(BigDecimal.valueOf(100)) // Convert to cents
                    .longValue();

            String successUrl = "http://localhost:5173/pay-success?payrollId=" + payrollId;
            String cancelUrl = "http://localhost:5173/pay-cancel";

            // Create Stripe session with payment details
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .putMetadata("payrollId", String.valueOf(payrollId)) // Optional: for webhooks
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("lkr")
                                                    .setUnitAmount(amountInCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Salary Payment for " + payroll.getEmployee().getName())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            StripeResponse response = StripeResponse.builder()
                    .status("SUCCESS")
                    .message("Stripe session created")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Helper method to calculate overtime pay if working hours exceed 40.
     * Assumes overtime is paid at 1.5x the base hourly rate.
     *
     * @param payroll - Payroll object containing employee details
     * @return Overtime amount (in LKR)
     */
    private BigDecimal calculateOvertime(Payroll payroll) {
        BigDecimal overtimeAmount = BigDecimal.ZERO;
        int standardHours = 40;
        int actualHours = payroll.getEmployee().getOperationalHours();
        if (actualHours > standardHours) {
            int overtimeHours = actualHours - standardHours;
            BigDecimal hourlyRate = payroll.getEmployee().getHourlyRate();
            overtimeAmount = hourlyRate.multiply(BigDecimal.valueOf(overtimeHours)).multiply(BigDecimal.valueOf(1.5));  // 1.5x rate for overtime
        }
        return overtimeAmount;
    }

    /**
     * This endpoint marks the payroll as "PAID" after the payment is successful.
     *
     * @param payrollId - The payroll ID to mark as PAID
     * @return ResponseEntity with the status
     */
    @PutMapping("/mark-paid/{payrollId}")
    public ResponseEntity<String> markAsPaid(@PathVariable Long payrollId) {
        Payroll payroll = payrollService.getPayrollById(payrollId);
        if (payroll == null) {
            return ResponseEntity.notFound().build();
        }

        payroll.setPaymentStatus("PAID");
        payrollService.save(payroll);

        return ResponseEntity.ok("Payroll marked as PAID");
    }
}
