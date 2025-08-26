//package com.cocopro.backend.service;
//
//import com.cocopro.backend.model.SensorData;
//import com.fazecast.jSerialComm.SerialPort;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.io.InputStream;
//import java.util.Scanner;
//
//@Service
//public class SerialCommunicationService {
//
//    @Autowired
//    private SensorService sensorService;
//
//    // Method to start serial communication and read data from the Arduino
//    public void startReadingSerialData() {
//        // Replace with the correct COM port of your system
//        SerialPort comPort = SerialPort.getCommPort("COM3"); // Update with your serial port
//        comPort.setBaudRate(115200);
//
//        // Open the serial port
//        if (comPort.openPort()) {
//            System.out.println("Connected to Arduino!");
//
//            // Create input stream to read data from the serial port
//            InputStream in = comPort.getInputStream();
//            Scanner scanner = new Scanner(in);
//
//            // Continuously read data from the serial port
//            while (scanner.hasNextLine()) {
//                String sensorDataStr = scanner.nextLine();
//                System.out.println("Received: " + sensorDataStr);
//
//                try {
//                    // Parse the sensor value from the input string
//                    Float sensorValue = Float.parseFloat(sensorDataStr.trim());
//
//                    // Create SensorData object and save it via the SensorService
//                    SensorData sensorData = new SensorData(sensorValue);
//                    sensorService.saveSensorData(sensorData);
//                    System.out.println("Sensor data saved: " + sensorDataStr);
//                } catch (NumberFormatException e) {
//                    System.err.println("Invalid sensor data received: " + sensorDataStr);
//                }
//            }
//
//            scanner.close();
//            comPort.closePort();
//        } else {
//            System.out.println("Failed to connect to Arduino.");
//        }
//    }
//}
