import React, { useState, useEffect, useContext } from 'react';
import {
  PlayIcon,
  PauseIcon,
  PowerIcon,
  AlertTriangleIcon,
  LockIcon,
  UnlockIcon,
  BellIcon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import ControlPanel, {
  SliderControl,
  ToggleControl,
  ActionButton,
} from '../components/ControlPanal';
import axios from 'axios';
import StatusCard from '../components/StatusCard';
import { systemStatus } from '../utils/mockData';
import TemperatureContext from '../context/TemperatureContext';
import TaskCompleteModal from '../components/TaskCompleteModal';
import { AuthContext } from '../../Login/AuthContext';

// Import sound file
import alarmSound from '../../../assets/danger_warning.mp3'; // Adjust path if needed

const ControlsPage = () => {
  const [motorSpeed, setMotorSpeed] = useState(systemStatus.motorSpeed);
  const [fanPower, setFanPower] = useState(65);
  const [targetMoisture, setTargetMoisture] = useState(() => {
    const saved = localStorage.getItem('targetMoisture');
    return saved ? parseFloat(saved) : 12;
  });
  const [irHeatingLamp, setIrHeatingLamp] = useState(false);
  const [systemRunning, setSystemRunning] = useState(() => {
    return localStorage.getItem('systemRunning') === 'true' || false;
  });
  const [controlLocked, setControlLocked] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState(localStorage.getItem('currentBatchId') || null);
  const { user } = useContext(AuthContext);

  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('dryingStartTime');
    return saved ? new Date(JSON.parse(saved)) : null;
  });

  const [latestSensorData, setLatestSensorData] = useState({
    moisture: 0,
    temperature: 0,
    humidity: 0,
  });

  const [latestColorData, setLatestColorData] = useState({
    blackDetected: false,
  });

  const [isCollecting, setIsCollecting] = useState(() => {
    return localStorage.getItem('systemRunning') === 'true' || false;
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // New state for sound toggle

  const { isOverheating, setIsOverheating } = useContext(TemperatureContext);

  // Create Audio instance for alarm sound
  const alarmAudio = new Audio(alarmSound);

  // Persist systemRunning to localStorage
  useEffect(() => {
    localStorage.setItem('systemRunning', systemRunning);
  }, [systemRunning]);

  // Persist startTime to localStorage
  useEffect(() => {
    if (startTime) {
      localStorage.setItem('dryingStartTime', JSON.stringify(startTime));
    } else {
      localStorage.removeItem('dryingStartTime');
    }
  }, [startTime]);

  // Persist targetMoisture to localStorage
  useEffect(() => {
    localStorage.setItem('targetMoisture', targetMoisture);
  }, [targetMoisture]);

  // Play or stop alarm sound based on blackDetected and isSoundEnabled status
  useEffect(() => {
    if (latestColorData.blackDetected && isSoundEnabled) {
      alarmAudio.loop = true;
      alarmAudio.play().catch((error) => {
        console.error('Error playing alarm sound:', error);
      });
    } else {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }

    return () => {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    };
  }, [latestColorData.blackDetected, isSoundEnabled]);

  const fetchLatestSensorData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sensor-data/latest');
      console.log('Fetched sensor data:', response.data);
      setLatestSensorData(response.data);

      if (response.data.moisture === targetMoisture) {
        handleStop();
        setIsTaskComplete(true);
        console.log('Target moisture level reached. System shut down.');
      }

      if (response.data.temperature > 35 && !isOverheating) {
        setIsOverheating(true);
      } else if (response.data.temperature <= 35 && isOverheating) {
        setIsOverheating(false);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const fetchLatestColorData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/color-data/latest');
      console.log('Fetched color data:', response.data);
      setLatestColorData(response.data || { blackDetected: false });
    } catch (error) {
      console.error('Error fetching color data:', error);
      setLatestColorData({ blackDetected: false });
    }
  };

  // Periodic fetching with 5-second interval
  useEffect(() => {
    let interval;
    if (isCollecting) {
      fetchLatestSensorData();
      fetchLatestColorData();
      interval = setInterval(() => {
        fetchLatestSensorData();
        fetchLatestColorData();
      }, 5000); // 5-second interval
    }
    return () => clearInterval(interval);
  }, [isCollecting, targetMoisture]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchLatestSensorData();
    fetchLatestColorData();
  }, []);

  const formatTime = (date) => {
    if (!date) return '—';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateElapsedTime = () => {
    if (!startTime) return '—';
    const now = new Date();
    const diff = now - startTime;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleStart = async () => {
    try {
      await axios.post('http://localhost:8080/api/sensor-data/start');
      setSystemRunning(true);
      setIsCollecting(true);

      const response = await axios.post(
        'http://localhost:8080/api/batch-processes/start',
        null,
        {
          params: {
            initialMoisture: latestSensorData.moisture,
            userEmail: user?.email,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.batchId) {
        const newStartTime = new Date();
        setStartTime(newStartTime);
        setCurrentBatchId(response.data.batchId);

        localStorage.setItem('dryingStartTime', JSON.stringify(newStartTime));
        localStorage.setItem('currentBatchId', response.data.batchId);
        localStorage.setItem('initialMoisture', latestSensorData.moisture);
        localStorage.setItem('targetMoisture', targetMoisture);

        console.log('Batch started:', response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error starting batch:', error);
      setSystemRunning(false);
      setIsCollecting(false);
    }
  };

  const handleStop = async () => {
    try {
      const batchId = localStorage.getItem('currentBatchId');
      if (!batchId) {
        console.error('No active batch to stop');
        return;
      }

      await axios.post('http://localhost:8080/api/sensor-data/stop');

      const response = await axios.post(
        'http://localhost:8080/api/batch-processes/stop',
        null,
        {
          params: {
            batchId,
            finalMoisture: latestSensorData.moisture,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log('Batch stopped:', response.data);
      } else {
        console.error('Empty response from server when stopping batch');
      }

      setSystemRunning(false);
      setIsCollecting(false);
      setCurrentBatchId(null);
      setStartTime(null);

      localStorage.removeItem('currentBatchId');
      localStorage.removeItem('dryingStartTime');
      localStorage.removeItem('systemRunning');
      localStorage.removeItem('initialMoisture');
    } catch (error) {
      console.error('Error stopping batch:', error);
      setSystemRunning(false);
      setIsCollecting(false);
      setCurrentBatchId(null);
      setStartTime(null);
      localStorage.removeItem('currentBatchId');
      localStorage.removeItem('dryingStartTime');
      localStorage.removeItem('systemRunning');
      localStorage.removeItem('initialMoisture');
    }
  };

  const handleEmergencyStop = async () => {
    try {
      await axios.post('http://localhost:8080/api/sensor-data/emergency-stop');
      console.log('Motor and IR turned OFF via emergency stop');
    } catch (error) {
      console.error('Error during emergency stop:', error);
    }
  };

  const toggleControlLock = () => {
    setControlLocked(!controlLocked);
  };

  const toggleAlarmSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">System Controls</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleControlLock}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              controlLocked ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {controlLocked ? (
              <>
                <LockIcon className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Controls Locked</span>
              </>
            ) : (
              <>
                <UnlockIcon className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Controls Unlocked</span>
              </>
            )}
          </button>
          <button
            onClick={toggleAlarmSound}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              isSoundEnabled ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSoundEnabled ? (
              <>
                <Volume2Icon className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Sound Enabled</span>
              </>
            ) : (
              <>
                <VolumeXIcon className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Sound Disabled</span>
              </>
            )}
          </button>
          <ActionButton
            label="Emergency Stop"
            onClick={handleEmergencyStop}
            variant="danger"
            icon={<PowerIcon className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlPanel title="Drying Process">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">System Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    systemRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {systemRunning ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>
              <ActionButton
                label="Start Process"
                onClick={handleStart}
                variant="success"
                icon={<PlayIcon className="h-5 w-5" />}
                fullWidth
                size="lg"
              />
              <br />
              <ActionButton
                label="Stop Process"
                onClick={handleStop}
                variant="warning"
                icon={<PauseIcon className="h-5 w-5" />}
                fullWidth
                size="lg"
              />
            </div>
            <SliderControl
              label="Target Moisture Level"
              value={targetMoisture}
              min={0}
              max={100}
              step={0.5}
              unit="%"
              onChange={setTargetMoisture}
              disabled={controlLocked || systemRunning}
            />
          </ControlPanel>
          <ControlPanel title="Hardware Controls">
            <SliderControl
              label="Motor Speed"
              value={motorSpeed}
              min={0}
              max={100}
              unit="%"
              onChange={setMotorSpeed}
              disabled={controlLocked || !systemRunning || autoMode}
            />
            <SliderControl
              label="Fan Power"
              value={fanPower}
              min={0}
              max={100}
              unit="%"
              onChange={setFanPower}
              disabled={controlLocked || !systemRunning || autoMode}
            />
            <ToggleControl
              label="IR Heating Lamp"
              value={irHeatingLamp}
              onChange={setIrHeatingLamp}
              disabled={controlLocked || !systemRunning || autoMode}
            />
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Advanced Settings</h4>
              <ActionButton
                label="Calibrate Sensors"
                onClick={() => {}}
                variant="primary"
                disabled={controlLocked || systemRunning}
                fullWidth
              />
            </div>
          </ControlPanel>
        </div>
        <div>
          <ControlPanel title="System Information">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Current Batch</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Batch ID:</div>
                  <div className="font-medium">{currentBatchId || '—'}</div>
                  <div className="text-gray-500">Start Time:</div>
                  <div className="font-medium">{formatTime(startTime)}</div>
                  <div className="text-gray-500">Elapsed Time:</div>
                  <div className="font-medium">{calculateElapsedTime()}</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">System Warnings</h4>
                {latestColorData.blackDetected ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start">
                      <BellIcon className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">Alarm Ringing</p>
                        <p className="text-sm text-red-700 mt-1">Black color detected by sensor. Buzzer is active.</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {systemStatus.weatherAlert.active ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-amber-800">Weather Warning</p>
                        <p className="text-sm text-amber-700 mt-1">{systemStatus.weatherAlert.message}</p>
                      </div>
                    </div>
                  </div>
                ) : !latestColorData.blackDetected ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">No warnings at this time</p>
                  </div>
                ) : null}
              </div>
              <div className="pt-3 border-t border-gray-200">
                {latestSensorData && (
                  <>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Current Readings</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <StatusCard
                        title="Current Moisture"
                        value={latestSensorData.moisture ?? '—'}
                        suffix="%"
                        icon={<></>}
                        status={latestSensorData.moisture > 20 ? 'warning' : 'normal'}
                      />
                      <StatusCard
                        title="Current Temperature"
                        value={latestSensorData.temperature ?? '—'}
                        suffix="°C"
                        icon={<></>}
                        status={latestSensorData.temperature > 35 ? 'warning' : 'normal'}
                      />
                      <StatusCard
                        title="Current Humidity"
                        value={latestSensorData.humidity ?? '—'}
                        suffix="%"
                        icon={<></>}
                        status={latestSensorData.humidity > 35 ? 'warning' : 'normal'}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Maintenance</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Last Cleaned:</div>
                  <div className="font-medium">2 days ago</div>
                  <div className="text-gray-500">Next Service:</div>
                  <div className="font-medium">In 28 days</div>
                </div>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
      <TaskCompleteModal
        isOpen={isTaskComplete}
        onClose={() => setIsTaskComplete(false)}
      />
    </div>
  );
};

export default ControlsPage;