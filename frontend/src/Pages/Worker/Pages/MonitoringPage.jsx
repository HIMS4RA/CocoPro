import React, { useState, useEffect } from 'react';
import DataChart from '../components/DataChart';
import StatusCard from '../components/StatusCard';
import Modal from '../components/Model';
import RadialGauge from '../components/RadialGauge';
import axios from 'axios';
import { format } from 'date-fns';
import {
  DropletIcon,
  ThermometerIcon,
  CloudIcon,
  AlertCircleIcon,
  GaugeIcon,
} from 'lucide-react';
import { environmentData, systemStatus } from '../utils/mockData';

const MonitoringPage = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [rpmData, setRpmData] = useState([]);
  const [currentRpm, setCurrentRpm] = useState(0);
  const [showRpmModal, setShowRpmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('dryingStartTime');
    return saved ? new Date(JSON.parse(saved)) : null;
  });

  const [batchInfo, setBatchInfo] = useState({
    batchId: localStorage.getItem('currentBatchId') || null,
    initialMoisture: localStorage.getItem('initialMoisture') || null,
    targetMoisture: localStorage.getItem('targetMoisture') || null,
  });

  const [latestSensorData, setLatestSensorData] = useState({
    moisture: 0,
    temperature: 0,
    humidity: 0,
  });

  const [moistureData, setMoistureData] = useState([]);
  const [environmentData, setEnvironmentData] = useState([]);

  const formatTime = (date) => {
    if (!date) return '—';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateProgress = () => {
    if (!batchInfo.initialMoisture || !batchInfo.targetMoisture || !latestSensorData.moisture) {
      return 0;
    }
    const initial = parseFloat(batchInfo.initialMoisture);
    const target = parseFloat(batchInfo.targetMoisture);
    const current = parseFloat(latestSensorData.moisture);
    if (initial <= target) return 0; // Invalid case
    const progress = ((initial - current) / (initial - target)) * 100;
    return Math.min(Math.max(Math.round(progress), 0), 100); // Clamp between 0 and 100
  };

  const fetchLatestSensorData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sensor-data/latest');
      setLatestSensorData(response.data);
      setCurrentRpm(response.data.rpm || 0);
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const moistureResponse = await axios.get('http://localhost:8080/api/sensor-data/moisture');
      const environmentResponse = await axios.get('http://localhost:8080/api/sensor-data/environment');

      const formattedMoistureData = moistureResponse.data.map((item) => ({
        time: format(new Date(item.timestamp), 'HH:mm'),
        moisture: item.moisture,
      }));

      const formattedEnvironmentData = environmentResponse.data.map((item) => ({
        time: format(new Date(item.timestamp), 'HH:mm'),
        temperature: item.temperature,
        humidity: item.humidity,
      }));

      setMoistureData(formattedMoistureData);
      setEnvironmentData(formattedEnvironmentData);

      const rpmResponse = await axios.get('http://localhost:8080/api/sensor-data/get');
      const formattedRpmData = rpmResponse.data
        .filter((item) => item.rpm > 0)
        .map((item) => ({
          rpm: item.rpm,
          timestamp: new Date(item.timestamp),
        }));
      setRpmData(formattedRpmData.slice(0, 20));
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    let interval;

    fetchLatestSensorData();
    fetchHistoricalData();

    interval = setInterval(() => {
      fetchLatestSensorData();
      fetchHistoricalData();

      // Update batch info from localStorage
      setBatchInfo({
        batchId: localStorage.getItem('currentBatchId') || null,
        initialMoisture: localStorage.getItem('initialMoisture') || null,
        targetMoisture: localStorage.getItem('targetMoisture') || null,
      });

      const savedStartTime = localStorage.getItem('dryingStartTime');
      setStartTime(savedStartTime ? new Date(JSON.parse(savedStartTime)) : null);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateExtendedData = (baseData, range) => {
    if (range === 'day') return baseData;
    const multiplier = range === 'week' ? 7 : 30;
    const result = [];
    for (let i = 0; i < multiplier; i++) {
      const dayOffset = i * 24;
      baseData.forEach((dataPoint) => {
        const time = `Day ${i + 1} ${dataPoint.time}`;
        const newPoint = { ...dataPoint, time };
        if ('temperature' in dataPoint && 'humidity' in dataPoint) {
          const tempVar = Math.random() * 5 - 2.5;
          const humVar = Math.random() * 6 - 3;
          newPoint.temperature = Math.round((dataPoint.temperature + tempVar) * 10) / 10;
          newPoint.humidity = Math.round(dataPoint.humidity + humVar);
        } else if ('moisture' in dataPoint) {
          const valueVar = Math.random() * 3 - 1.5;
          newPoint.moisture = Math.round((dataPoint.moisture + valueVar) * 10) / 10;
        }
        result.push(newPoint);
      });
    }
    return result;
  };

  const currentEnvData = generateExtendedData(environmentData, timeRange);

  const currentMoistureData = generateExtendedData(moistureData, timeRange);

  const alerts = [
    latestSensorData.temperature > 70
      ? {
          type: 'warning',
          message: 'Temperature exceeding optimal range',
          value: `${latestSensorData.temperature}°C`,
        }
      : null,
    latestSensorData.moisture > 20
      ? {
          type: 'warning',
          message: 'Moisture level higher than target',
          value: `${latestSensorData.moisture}%`,
        }
      : null,
    currentRpm > 1300 || currentRpm < 1000
      ? {
          type: 'warning',
          message: 'RPM outside optimal range',
          value: `${currentRpm} RPM`,
        }
      : null,
    systemStatus.weatherAlert.active
      ? {
          type: 'info',
          message: systemStatus.weatherAlert.message,
          value: '',
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Real-Time Drying Monitoring</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${timeRange === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
              onClick={() => setTimeRange('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-300`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestSensorData && (
          <>
            <StatusCard
              title="Current Moisture"
              value={latestSensorData.moisture}
              suffix="%"
              icon={<DropletIcon className="h-5 w-5" />}
              status={latestSensorData.moisture > 20 ? 'warning' : 'normal'}
            />
            <StatusCard
              title="Temperature"
              value={latestSensorData.temperature}
              suffix="°C"
              icon={<ThermometerIcon className="h-5 w-5" />}
              status={latestSensorData.temperature > 70 ? 'warning' : 'normal'}
            />
            <StatusCard
              title="Humidity"
              value={latestSensorData.humidity}
              suffix="%"
              icon={<CloudIcon className="h-5 w-5" />}
              status="normal"
            />
            <StatusCard
              title="Motor RPM"
              value={currentRpm}
              suffix="RPM"
              icon={<GaugeIcon className="h-5 w-5" />}
              status={
                isLoading
                  ? 'normal'
                  : currentRpm > 1300 || currentRpm < 1000
                  ? 'warning'
                  : 'normal'
              }
              onClick={() => setShowRpmModal(true)}
              clickable
            />
          </>
        )}
      </div>

      <Modal isOpen={showRpmModal} onClose={() => setShowRpmModal(false)} title="RPM Monitoring">
        <div className="space-y-4">
          <div className="flex justify-center">
            <RadialGauge
              value={currentRpm}
              min={800}
              max={1500}
              label="RPM"
              units="RPM"
              width={300}
              height={300}
              colorRanges={[
                { min: 800, max: 1000, color: '#ef4444' },
                { min: 1000, max: 1300, color: '#10b981' },
                { min: 1300, max: 1500, color: '#ef4444' },
              ]}
            />
          </div>
          <DataChart
            title="RPM Trend"
            data={rpmData.map((item) => ({
              time: item.timestamp.toLocaleTimeString(),
              rpm: item.rpm,
            }))}
            lines={[
              {
                dataKey: 'rpm',
                color: '#3b82f6',
                name: 'RPM',
                strokeWidth: 2,
              },
            ]}
            height={250}
          />
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataChart
          title="Moisture Level Trend"
          data={currentMoistureData}
          lines={[
            {
              dataKey: 'moisture',
              color: '#3b82f6',
              name: 'Moisture %',
            },
          ]}
          height={300}
        />
        <DataChart
          title="Environmental Conditions"
          data={currentEnvData}
          lines={[
            {
              dataKey: 'temperature',
              color: '#ef4444',
              name: 'Temperature (°C)',
            },
            {
              dataKey: 'humidity',
              color: '#3b82f6',
              name: 'Humidity (%)',
            },
          ]}
          height={300}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-4">System Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Target Values</h4>
              <div className="space-y-3">
              <div>
  <div className="flex justify-between text-sm mb-1">
    <span>Target Moisture</span>
    <span className="font-medium">
      {batchInfo.targetMoisture
        ? `${parseFloat(batchInfo.targetMoisture).toFixed(1)}%`
        : '12.0%'}
    </span>
  </div>
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-500 rounded-full transition-all duration-300"
      style={{
        width: `${batchInfo.targetMoisture ? parseFloat(batchInfo.targetMoisture) : 12}%`,
      }}
    ></div>
  </div>
</div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Optimal Temperature</span>
                    <span className="font-medium">35.0°C</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${(latestSensorData.temperature / 70) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ideal Humidity</span>
                    <span className="font-medium">40.0%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${(latestSensorData.humidity / 100) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Current Batch Info</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Batch ID:</div>
                  <div className="font-medium text-gray-800">{batchInfo.batchId || '—'}</div>
                  <div className="text-gray-600">Start Time:</div>
                  <div className="font-medium text-gray-800">{formatTime(startTime)}</div>
                  <div className="text-gray-600">Initial Moisture:</div>
                  <div className="font-medium text-gray-800">
                    {batchInfo.initialMoisture ? `${parseFloat(batchInfo.initialMoisture).toFixed(1)}%` : '—'}
                  </div>
                  <div className="text-gray-600">Target Moisture:</div>
                  <div className="font-medium text-gray-800">
                    {batchInfo.targetMoisture ? `${parseFloat(batchInfo.targetMoisture).toFixed(1)}%` : '—'}
                  </div>
                  <div className="text-gray-600">Progress:</div>
                  <div className="font-medium text-gray-800">{calculateProgress()}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">System Alerts</h3>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 border border-amber-200'
                      : alert.type === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-start">
                    <AlertCircleIcon
                      className={`h-5 w-5 ${
                        alert.type === 'warning'
                          ? 'text-amber-600'
                          : alert.type === 'error'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      } mt-0.5`}
                    />
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          alert.type === 'warning'
                            ? 'text-amber-800'
                            : alert.type === 'error'
                            ? 'text-red-800'
                            : 'text-blue-800'
                        }`}
                      >
                        {alert.message}
                      </p>
                      {alert.value && <p className="text-sm mt-1">{alert.value}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start">
                <AlertCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">All systems normal</p>
                  <p className="text-sm mt-1 text-green-700">No alerts at this time</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Camera Feed</h4>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Camera feed not available</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  Refresh feed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;