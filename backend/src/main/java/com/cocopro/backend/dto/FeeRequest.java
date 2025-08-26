package com.cocopro.backend.dto;


import lombok.*;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeeRequest {
    private Long amount;
    private String currency;


}