// src/main/java/com/cocopro/backend/controller/WeatherController.java
package com.cocopro.backend.controller;

import com.cocopro.backend.model.WeatherData;
import com.cocopro.backend.service.WeatherService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")

@CrossOrigin("http://localhost:5173")

public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public WeatherData getCurrentWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        return weatherService.getCurrentWeather(lat, lon);
    }

    @PostMapping("/save")
    public void saveWeatherReport(@RequestBody WeatherData data) {
        weatherService.saveWeatherData(data);
    }

    // New endpoint to get all saved reports
    @GetMapping("/report")
    public List<WeatherData> getWeatherReports() {
        return weatherService.getAllWeatherReports();
    }
}