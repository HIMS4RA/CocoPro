package com.cocopro.backend.controller;


import com.cocopro.backend.model.SensorData;
import com.cocopro.backend.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sensor-data")
@CrossOrigin(origins = "*")
public class SensorController {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    @PostMapping("/save")
    public ResponseEntity<String> receiveSensorData(@RequestBody SensorData sensorData) {
        if (sensorData.getTemperature() == 0 && sensorData.getHumidity() == 0) {
            return ResponseEntity.badRequest().body("Invalid sensor data");
        }
        sensorDataRepository.save(sensorData);
        return ResponseEntity.ok("Sensor data saved successfully");
    }

    @GetMapping("/get")
    public ResponseEntity<List<SensorData>> getSensorData() {
        return ResponseEntity.ok(sensorDataRepository.findAll());
    }

    @GetMapping("/latest")
    public ResponseEntity<SensorData> getLatestSensorData() {
        SensorData latest = sensorDataRepository.findTopByOrderByIdDesc();
        return ResponseEntity.ok(latest);
    }

    // New endpoint to fetch historical moisture data
    @GetMapping("/moisture")
    public ResponseEntity<List<SensorData>> getMoistureData() {
        LocalDateTime fiveHoursAgo = LocalDateTime.now().minusHours(5);
        List<SensorData> moistureData = sensorDataRepository.findByTimestampAfterOrderByTimestampAsc(fiveHoursAgo);
        return ResponseEntity.ok(moistureData);
    }

    // New endpoint to fetch historical environment data (temperature and humidity)
    @GetMapping("/environment")
    public ResponseEntity<List<SensorData>> getEnvironmentData() {
        LocalDateTime fiveHoursAgo = LocalDateTime.now().minusHours(5);
        List<SensorData> environmentData = sensorDataRepository.findByTimestampAfterOrderByTimestampAsc(fiveHoursAgo);
        return ResponseEntity.ok(environmentData);
    }

    private boolean isCollecting = false;

    @PostMapping("/start")
    public ResponseEntity<String> startSensorCollection() {
        isCollecting = true;
        System.out.println(isCollecting);
        return ResponseEntity.ok("Sensor data collection started");
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stopSensorCollection() {

        isCollecting = false;
        System.out.println(isCollecting);
        return ResponseEntity.ok("Sensor data collection stopped");
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> getSensorStatus() {
        return ResponseEntity.ok(isCollecting);
    }

    private boolean isMotorIROn = true; // Default to ON

    // New endpoint for emergency stop
    @PostMapping("/emergency-stop")
    public ResponseEntity<String> emergencyStop() {
        isMotorIROn = false; // Turn off heating
        System.out.println("Motor and IR turned OFF via emergency stop");
        return ResponseEntity.ok("Motor and IR turned OFF");
    }

    // New endpoint to check heating status
    @GetMapping("/MotorIR-status")
    public ResponseEntity<Boolean> getMotorIRStatus() {
        return ResponseEntity.ok(isMotorIROn);
    }
}
