
package com.cocopro.backend.repository;

import com.cocopro.backend.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WeatherRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByCity(String city);
    List<WeatherData> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}