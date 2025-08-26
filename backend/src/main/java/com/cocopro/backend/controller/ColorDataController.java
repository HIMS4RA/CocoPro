package com.cocopro.backend.controller;

import com.cocopro.backend.model.ColorData;
import com.cocopro.backend.repository.ColorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/color-data")
@CrossOrigin("http://localhost:5173") // or set to your frontend URL
public class ColorDataController {

    @Autowired
    private ColorDataRepository repository;

    @PostMapping("/save")
    public ResponseEntity<String> saveColorData(@RequestBody ColorData colorData) {
        int diffRG = Math.abs(colorData.getRed() - colorData.getGreen());
        int diffRB = Math.abs(colorData.getRed() - colorData.getBlue());
        int diffGB = Math.abs(colorData.getGreen() - colorData.getBlue());

        boolean isBlack = colorData.getRed() > 200 &&
                colorData.getGreen() > 200 &&
                colorData.getBlue() > 200 &&
                (diffRG > 50 || diffRB > 50 || diffGB > 50);

        colorData.setBlackDetected(isBlack);
        repository.save(colorData);

        return ResponseEntity.ok(isBlack ? "Black detected!" : "Not black");
    }

    @GetMapping("/latest")
    public ResponseEntity<ColorData> getLatestData() {
        return ResponseEntity.of(repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp")).stream().findFirst());
    }
}

