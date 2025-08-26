package com.cocopro.backend.repository;



import com.cocopro.backend.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    SensorData findTopByOrderByIdDesc();

    // Fetch all sensor data sorted by timestamp in ascending order
    List<SensorData> findByTimestampAfterOrderByTimestampAsc(LocalDateTime timestamp);
}
