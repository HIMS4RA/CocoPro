#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// LCD Setup (I2C Address 0x27, 16x2 Display)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// DHT Sensor Setup
#define DHTPIN 5      
#define DHTTYPE DHT11  
DHT dht(DHTPIN, DHTTYPE);

// Moisture Sensor & SSR Pin
#define MOISTURE_PIN 34  
#define SSR_PIN 4        
#define SPEED_SENSOR_PIN 15  // RPM Sensor

// WiFi & Server Details
const char* ssid = "Tashen";
const char* password = "tashen20030829";
const char* serverUrl = "http://192.168.1.8:8080/api/sensor-data/save";
const char* statusUrl = "http://192.168.1.8:8080/api/sensor-data/status";
const char* rpmUrl = "http://192.168.1.8:8080/api/sensor-data/rpm";  // New URL for RPM data

// RPM Measurement Variables
volatile unsigned long LastTimeWeMeasured;
volatile unsigned long PeriodBetweenPulses = 100000 + 1000;
volatile unsigned long PeriodAverage = 100000 + 1000;
const byte PulsesPerRevolution = 2;
unsigned long RPM;
unsigned long total = 0;
const byte numReadings = 2;
unsigned long readings[numReadings];
unsigned long readIndex = 0;

void IRAM_ATTR Pulse_Event() {
    unsigned long currentTime = micros();
    if (currentTime - LastTimeWeMeasured > 1000) {  // Ignore pulses <1ms apart
        PeriodBetweenPulses = currentTime - LastTimeWeMeasured;
        LastTimeWeMeasured = currentTime;
        PeriodAverage = PeriodBetweenPulses;
    }
}

// WiFi Connection
void connectWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi!");
}

void setup() {
    Serial.begin(115200);
    lcd.init();
    lcd.backlight();
    dht.begin();

    pinMode(SSR_PIN, OUTPUT);
    pinMode(SPEED_SENSOR_PIN, INPUT_PULLUP);  // Enable internal pull-up resistor
    attachInterrupt(digitalPinToInterrupt(SPEED_SENSOR_PIN), Pulse_Event, RISING);

    connectWiFi();
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(statusUrl);
        int statusResponse = http.GET();
        if (statusResponse > 0) {
            String status = http.getString();
            if (status == "true") {  // System active
                float temperature = dht.readTemperature();
                float humidity = dht.readHumidity();
                int moistureValue = analogRead(MOISTURE_PIN);
                int moisturePercentage = map(moistureValue, 4095, 1000, 0, 100);
                moisturePercentage = constrain(moisturePercentage, 0, 100);

                // RPM Calculation
                if (PeriodAverage > 1000) {  // Prevents extreme values
                    RPM = (60000000UL / (PeriodAverage * PulsesPerRevolution));  
                } else {
                    RPM = 0;  // No rotation
                }

                // Moving Average Filter for RPM
                total = total - readings[readIndex];
                readings[readIndex] = RPM;
                total = total + readings[readIndex];
                readIndex = (readIndex + 1) % numReadings;
                unsigned long averageRPM = total / numReadings;

                // Display on LCD
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("T:");
                lcd.print(temperature, 1);
                lcd.print("C H:");
                lcd.print(humidity, 0);
                lcd.print("%");

                lcd.setCursor(0, 1);
                lcd.print("M:");
                lcd.print(moisturePercentage);
                lcd.print("% R:");
                lcd.print(averageRPM);
                lcd.print("RPM");

                // Print to Serial Monitor
                Serial.print("Temp: "); Serial.print(temperature);
                Serial.print(" °C | Hum: "); Serial.print(humidity);
                Serial.print(" % | Moisture: "); Serial.print(moisturePercentage);
                Serial.print(" % | RPM: "); Serial.println(averageRPM);

                // Send Data to Server
                String jsonData = "{\"temperature\":" + String(temperature) +
                                  ", \"humidity\":" + String(humidity) +
                                  ", \"moisture\":" + String(moisturePercentage) +
                                  ", \"rpm\":" + String(averageRPM) + "}";

                HTTPClient postHttp;
                postHttp.begin(serverUrl);
                postHttp.addHeader("Content-Type", "application/json");
                int httpResponseCode = postHttp.POST(jsonData);

                if (httpResponseCode > 0) {
                    Serial.println("Data sent successfully!");
                } else {
                    Serial.print("Error sending POST request: ");
                    Serial.println(httpResponseCode);
                }

                postHttp.end();
            } else {
                Serial.println("Sensor is stopped. Turning off system.");
                digitalWrite(SSR_PIN, LOW);
            }
        } else {
            Serial.println("Error checking system status.");
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected! Reconnecting...");
        connectWiFi();
    }
    delay(5000);
}
