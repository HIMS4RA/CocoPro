#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Pin Definitions
#define DHTPIN 5           // DHT11 sensor data pin
#define DHTTYPE DHT11      // DHT sensor type
#define MOISTURE_PIN 34    // Analog pin for moisture sensor
#define SSR_PIN 4          // GPIO pin controlling the heating element

// DHT Sensor Initialization
DHT dht(DHTPIN, DHTTYPE);

// WiFi and Server Configuration

const char* ssid = "Tashen’s iPhone";
const char* password = "gal ibba";
const char* serverUrl = "http://172.20.10.2:8080/api/sensor-data/save";
const char* statusUrl = "http://172.20.10.2:8080/api/sensor-data/status";
const char* MotorIRStatusUrl = "http://172.20.10.2:8080/api/sensor-data/MotorIR-status"; // New URL for heating status


// Timer Variables
unsigned long overheatStartTime = 0;  // Stores the time when temp > 35°C
bool overheatTimerActive = false;     // Flag to track if timer is running

void setup() {
    Serial.begin(115200);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    // Initialize DHT Sensor
    dht.begin();

    // Configure SSR as output and turn heating ON initially
    pinMode(SSR_PIN, OUTPUT);
    digitalWrite(SSR_PIN, HIGH);
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

                // Check heating status from backend
                HTTPClient MotorIRHttp;
                MotorIRHttp.begin(MotorIRStatusUrl);
                int MotorIRResponse = MotorIRHttp.GET();

                if (MotorIRResponse > 0) {
                    String MotorIRStatus = MotorIRHttp.getString();
                    if (MotorIRStatus == "false") {
                        digitalWrite(SSR_PIN, LOW); // Turn heating OFF
                        Serial.println("Motor and IR turned OFF via emergency stop");
                    } else {
                        // Heating Control Logic
                        if (temperature > 35) {
                            if (!overheatTimerActive) {
                                overheatTimerActive = true;
                                overheatStartTime = millis(); // Start 10s timer
                                Serial.println("Overheat detected! Starting 10s timer...");
                            } else if (millis() - overheatStartTime >= 10000) {  
                                digitalWrite(SSR_PIN, LOW);  // Turn heating OFF after 10s
                                Serial.println("Motor and IR OFF after sustained high temperature!");
                            }
                        } else {
                            if (overheatTimerActive) {
                                Serial.println("Temperature back to normal! Timer canceled.");
                                overheatTimerActive = false;  // Cancel timer
                            }
                            digitalWrite(SSR_PIN, HIGH); // Keep Motor and IR ON
                            Serial.println("Motor and IR ON");
                        }
                    }
                } else {
                    Serial.println("Error checking Motor and IR status");
                }

                MotorIRHttp.end();

                // Log sensor data
                Serial.print("Sending Data -> Temp: ");
                Serial.print(temperature);
                Serial.print(" °C, Hum: ");
                Serial.print(humidity);
                Serial.print(" %, Moisture: ");
                Serial.println(moisturePercentage);

                // Prepare JSON payload
                String jsonData = "{\"temperature\":" + String(temperature) +
                                ", \"humidity\":" + String(humidity) +
                                ", \"moisture\":" + String(moisturePercentage) + "}";

                // Send data to the server
                HTTPClient postHttp;
                postHttp.begin(serverUrl);
                postHttp.addHeader("Content-Type", "application/json");

                int httpResponseCode = postHttp.POST(jsonData);

                if (httpResponseCode > 0) {
                    Serial.println("Data sent successfully");
                } else {
                    Serial.print("Error sending POST request: ");
                    Serial.println(httpResponseCode);
                }

                postHttp.end();
            } else {
                Serial.println("Sensor is stopped. Turning Motor and IR OFF.");
                digitalWrite(SSR_PIN, LOW); // Turn OFF Motor and IR when system is inactive
                overheatTimerActive = false; // Reset timer flag
            }
        } else {
            Serial.println("Error checking status");
        }

        http.end();
    } else {
        Serial.println("WiFi Disconnected!");
    }

    delay(5000);  // Wait before the next data check
}