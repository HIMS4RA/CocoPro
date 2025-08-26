package com.cocopro.backend.service;

import com.cocopro.backend.dto.StripeResponse;
import com.cocopro.backend.model.Payroll;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentListParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

@Service
public class StripeService {

    @Value("${stripe.secretKey}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    /**
     * Creates a Stripe payment session for a given payroll.
     * @param payrollId The payroll ID to create a payment session for
     * @return StripeResponse containing session info
     */
    public StripeResponse createPayrollPaymentSession(Long payrollId, Payroll payroll) {
        // Ensure that the payroll and necessary payment data are provided
        if (payroll == null || payroll.getNetSalary() == null || payroll.getNetSalary().compareTo(BigDecimal.ZERO) <= 0) {
            return StripeResponse.builder()
                    .status("FAILED")
                    .message("Invalid payroll details or amount")
                    .build();
        }

        try {
            // Convert the payroll net salary to the correct unit (cents)
            long amountInCents = payroll.getNetSalary()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            // Build the Stripe session parameters
            String successUrl = "http://localhost:5173/pay-success?payrollId=" + payrollId;
            String cancelUrl = "http://localhost:5173/pay-cancel";

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("lkr") // Set the correct currency (LKR)
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

            // Create the session and retrieve the session URL
            Session session = Session.create(params);

            // Return the response with session details
            return StripeResponse.builder()
                    .status("SUCCESS")
                    .message("Payment session created")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            e.printStackTrace();
            return StripeResponse.builder()
                    .status("FAILED")
                    .message("Stripe error: " + e.getMessage())
                    .build();
        }
    }

    // Fetch all payment transactions (for example purposes, limit can be adjusted)
    public List<PaymentIntent> getAllPayments() throws StripeException {
        // Define how many payment intents to fetch
        PaymentIntentListParams params = PaymentIntentListParams.builder()
                .setLimit(10L) // Change the limit as needed
                .build();

        PaymentIntentCollection payments = PaymentIntent.list(params);
        return payments.getData();
    }
}
