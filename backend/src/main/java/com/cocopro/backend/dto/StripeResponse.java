package com.cocopro.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor


public class StripeResponse {
    // Getters and setters
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;

    private StripeResponse(Builder builder) {
        this.status = builder.status;
        this.message = builder.message;
        this.sessionId = builder.sessionId;
        this.sessionUrl = builder.sessionUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String status;
        private String message;
        private String sessionId;
        private String sessionUrl;

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public Builder sessionUrl(String sessionUrl) {
            this.sessionUrl = sessionUrl;
            return this;
        }

        public StripeResponse build() {
            return new StripeResponse(this);
        }
    }


}