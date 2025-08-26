//package com.cocopro.backend.service;
//
//import com.cocopro.backend.model.SensorData;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class SensorService {
//    private List<SensorData> sensorDataList = new ArrayList<>();
//
//    public void saveSensorData(SensorData sensorData) {
//        System.out.println(sensorData.getHumidity());
//        System.out.println(sensorData.getMoisture());
//        System.out.println(sensorData.getTemperature());
//
//        sensorDataList.add(sensorData);
//    }
//
//    public List<SensorData> getAllSensorData() {
//        return sensorDataList;
//    }
//}