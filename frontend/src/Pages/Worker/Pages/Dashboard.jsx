import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DropletIcon,
  ThermometerIcon,
  CloudIcon,
  GaugeIcon,
  FanIcon,
  ClockIcon,
  CloudRainIcon,
  SunIcon,
} from 'lucide-react'
import StatusCard from '../components/StatusCard'
import DataChart from '../components/DataChart'
import NotificationPanel from '../components/NotificationPanal'
import {
  systemStatus,
  moistureData,
  environmentData,
  notifications,
} from '../utils/mockData'
import { format } from 'date-fns'

const API_KEY = "20ab17c0b1e953646aa3d17dba0deadc";

const Dashboard = () => {
  const [latestSensorData, setLatestSensorData] = useState({
    moisture: 0,
    temperature: 0,
    humidity: 0,
  });

  const [systemStatus, setSystemStatus] = useState({
    status: "idle",
    fanStatus: "inactive",
    motorSpeed: 0,
    estimatedDryingTime: "N/A",
    weatherAlert: { active: false, message: "" },
  });

  const [moistureData, setMoistureData] = useState([]);
  const [environmentData, setEnvironmentData] = useState([]);

  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Get User's Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        () => {
          setError("Geolocation disabled. Using default location.");
          setLocation({ lat: 6.900, lon: -79.950 }); // Default: Malabe
        }
      );
    } else {
      setError("Geolocation not supported by browser.");
    }
  }, []);

  // Fetch Weather Data Every Minute
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location.lat || !location.lon) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(response.data);
        setAlertMessage(generateWeatherAlert(response.data));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch weather data.");
        setLoading(false);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 60 * 1000); // Fetch every 1 minute (60,000ms)
    return () => clearInterval(interval);
  }, [location]);


  // Generate Weather Alerts
  const generateWeatherAlert = (data) => {
    if (!data || !data.main || !data.wind || !data.clouds) return [];

    const { temp, feels_like } = data.main;
    const { speed: windSpeed } = data.wind;
    const { all: cloudCoverage } = data.clouds;

    const alerts = [];

    // Temperature Alerts
    if (temp > 35) {
      alerts.push({
        type: 'danger',
        icon: <ThermometerIcon className="h-5 w-5 text-red-500" />,
        title: 'Extreme Heat Alert',
        message: `Current temp: ${temp}°C (Feels like: ${feels_like}°C)`
      });
    } else if (temp >= 25 && temp <= 35) {
      alerts.push({
        type: 'info',
        icon: <ThermometerIcon className="h-5 w-5 text-blue-500" />,
        title: 'Normal Temperature',
        message: `${temp}°C (Feels like: ${feels_like}°C)`
      });
    } else if (temp < 15) {
      alerts.push({
        type: 'warning',
        icon: <ThermometerIcon className="h-5 w-5 text-amber-500" />,
        title: 'Cold Temperature Alert',
        message: Current `temp: ${temp}°C (Feels like: ${feels_like}°C)`
      });
    }

    // Wind Speed Alerts
    if (windSpeed > 10) {
      alerts.push({
        type: 'danger',
        icon: <FanIcon className="h-5 w-5 text-red-500" />,
        title: 'Strong Winds',
        message: `Wind speed: ${windSpeed} m/s`
      });
    } else if (windSpeed >= 3 && windSpeed <= 10) {
      alerts.push({
        type: 'info',
        icon: <FanIcon className="h-5 w-5 text-blue-500" />,
        title: 'Moderate Winds',
        message: `Wind speed: ${windSpeed} m/s`
      });
    } else if (windSpeed < 3) {
      alerts.push({
        type: 'success',
        icon: <FanIcon className="h-5 w-5 text-green-500" />,
        title: 'Light Winds',
        message: `Wind speed: ${windSpeed} m/s`
      });
    }

    // Cloud Coverage Alerts
    if (cloudCoverage > 70) {
      alerts.push({
        type: 'warning',
        icon: <CloudRainIcon className="h-5 w-5 text-amber-500" />,
        title: 'Heavy Cloud Coverage',
        message: `${cloudCoverage}%`
      });
    } else if (cloudCoverage >= 40 && cloudCoverage <= 70) {
      alerts.push({
        type: 'info',
        icon: <CloudIcon className="h-5 w-5 text-blue-500" />,
        title: 'Moderate Cloud Coverage',
        message: `${cloudCoverage}%`
      });
    } else if (cloudCoverage < 40) {
      alerts.push({
        type: 'success',
        icon: <SunIcon className="h-5 w-5 text-green-500" />,
        title: 'Clear Skies',
        message: `${cloudCoverage}% cloud coverage`
      });
    }

    return alerts;
  };

  // Format moisture data for chart
  const formattedMoistureData = moistureData.map((item) => ({
    time: item.time,
    moisture: item.value,
  }));
  


  const fetchLatestSensorData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sensor-data/latest");
      setLatestSensorData(response.data);
    } catch (error) {
      console.error("Error fetching latest sensor data:", error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const moistureResponse = await axios.get("http://localhost:8080/api/sensor-data/moisture");
      const environmentResponse = await axios.get("http://localhost:8080/api/sensor-data/environment");

      // Format moisture data for the chart
      const formattedMoistureData = moistureResponse.data.map((item) => ({
        time: format(new Date(item.timestamp), "HH:mm"),
        moisture: item.moisture,
      }));

      // Format environment data for the chart
      const formattedEnvironmentData = environmentResponse.data.map((item) => ({
        time: format(new Date(item.timestamp), "HH:mm"),
        temperature: item.temperature,
        humidity: item.humidity,
      }));

      setMoistureData(formattedMoistureData);
      setEnvironmentData(formattedEnvironmentData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  useEffect(() => {
    let interval;

    // Fetch data immediately when the component mounts
    fetchLatestSensorData();
    fetchHistoricalData();

    // Set up an interval to fetch data every 5 seconds
    interval = setInterval(() => {
      fetchLatestSensorData();
      fetchHistoricalData();
    }, 5000); // Fetch every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);


  


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {latestSensorData && (
          <>
            <StatusCard 
              title="Current Moisture"
              value={latestSensorData.moisture ?? 0}
              suffix="%"
              icon={<DropletIcon className="h-5 w-5" />}
              status={latestSensorData.moisture > 20 ? 'warning' : 'normal'}
            />
            <StatusCard
              title="Temperature"
              value={latestSensorData.temperature ?? 0} 
              suffix="°C"
              icon={<ThermometerIcon className="h-5 w-5" />}
              status={latestSensorData.temperature > 34 ? 'warning' : 'normal'}
            />
            <StatusCard
              title="Humidity"
              value={latestSensorData.humidity ?? 0}
              suffix="%"
              icon={<CloudIcon className="h-5 w-5" />}
              status="normal"
            />
          </>
        )}
        <StatusCard
          title="System Status"
          value={
            systemStatus.status
              ? systemStatus.status.charAt(0).toUpperCase() + systemStatus.status.slice(1)
              : 'Unknown'
          }
          icon={<GaugeIcon className="h-5 w-5" />}
          status={
            systemStatus.status === 'running'
              ? 'success'
              : systemStatus.status === 'error'
                ? 'danger'
                : 'warning'
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <DataChart
            title="Moisture Level Trend (Last 5 Hours)"
            data={moistureData}
            lines={[{
              dataKey: 'moisture',
              color: '#3b82f6',
              name: 'Moisture %',
            }]}
            height={300}
          />
        </div>
        <div>
          <NotificationPanel
            notifications={notifications.filter((n) => !n.read).slice(0, 3)}
            maxHeight="300px"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            System Controls
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FanIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Fan Status</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${systemStatus.fanStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {systemStatus.fanStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <GaugeIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Motor Speed</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${systemStatus.motorSpeed}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {systemStatus.motorSpeed}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Est. Drying Time</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {systemStatus.estimatedDryingTime}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Environmental Data (Last 5 Hours)
          </h3>
          <DataChart
            title=""
            data={environmentData}
            lines={[
              {
                dataKey: 'temperature',
                color: '#ef4444',
                name: 'Temperature (°F)',
              },
              {
                dataKey: 'humidity',
                color: '#3b82f6',
                name: 'Humidity (%)',
              },
            ]}
            height={200}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Weather Alert
          </h3>
          
          {loading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 animate-pulse">
              <div className="h-5 w-5 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <CloudIcon className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    Error Loading Weather
                  </h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : alertMessage && alertMessage.length > 0 ? (
            <div className="space-y-2">
              {alertMessage.map((alert, index) => (
                <div 
                  key={index}
                  className={`border-l-4 rounded-r p-3 ${
                    alert.type === 'danger' 
                      ? 'bg-red-50 border-red-500' 
                      : alert.type === 'warning' 
                        ? 'bg-amber-50 border-amber-500' 
                        : alert.type === 'info' 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-start">
                    {alert.icon}
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-800">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <SunIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">
                    All Clear
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    No weather alerts at this time.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Upcoming Forecast
            </h4>
            <div className="flex justify-between">
              <div className="text-center">
                <span className="text-xs text-gray-500">Now</span>
                {weatherData?.weather?.[0]?.main.includes('Rain') ? (
                  <CloudRainIcon className="h-6 w-6 text-gray-600 mx-auto my-1" />
                ) : (
                  <SunIcon className="h-6 w-6 text-gray-600 mx-auto my-1" />
                )}
                <span className="text-xs font-medium">
                  {weatherData?.main?.temp ? Math.round(weatherData.main.temp) : '--'}°
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">2h</span>
                <CloudRainIcon className="h-6 w-6 text-gray-600 mx-auto my-1" />
                <span className="text-xs font-medium">68°</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">4h</span>
                <CloudRainIcon className="h-6 w-6 text-gray-600 mx-auto my-1" />
                <span className="text-xs font-medium">65°</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">6h</span>
                <CloudIcon className="h-6 w-6 text-gray-600 mx-auto my-1" />
                <span className="text-xs font-medium">69°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;