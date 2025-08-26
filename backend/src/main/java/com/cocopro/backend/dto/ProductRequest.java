package com.cocopro.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductRequest {

    private Long amount;
    private Long quantity;
    private String currency;
    private String name;




}
