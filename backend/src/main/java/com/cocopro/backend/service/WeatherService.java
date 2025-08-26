// src/main/java/com/cocopro/backend/service/WeatherService.java
package com.cocopro.backend.service;

import com.cocopro.backend.model.WeatherData;
import com.cocopro.backend.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class WeatherService {

    private static final String API_KEY = "20ab17c0b1e953646aa3d17dba0deadc";
    private static final String API_URL = "https://api.openweathermap.org/data/3.0/onecall";

    private final WeatherRepository weatherRepository;

    @Autowired
    private final RestTemplate restTemplate;


    public WeatherService(WeatherRepository weatherRepository, RestTemplate restTemplate) {
        this.weatherRepository = weatherRepository;
        this.restTemplate = restTemplate;
    }

    public WeatherData getCurrentWeather(double lat, double lon) {
        String url = String.format("%s?lat=%f&lon=%f&exclude=minutely,hourly,alerts&units=metric&appid=%s",
                API_URL, lat, lon, API_KEY);

        // Parse response and map to your WeatherData model
        return restTemplate.getForObject(url, WeatherData.class);
    }

    public void saveWeatherData(WeatherData data) {
        weatherRepository.save(data);
    }

    public List<WeatherData> getAllWeatherReports() {
        return weatherRepository.findAll();
    }
}