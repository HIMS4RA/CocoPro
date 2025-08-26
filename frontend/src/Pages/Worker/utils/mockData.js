// Mock data for the CocoPro system
// Current system status
export const systemStatus = {
    status: 'running', // 'running', 'stopped', 'error', 'maintenance'
    currentMoisture: 14.2,
    currentTemperature: 65.8,
    currentHumidity: 42,
    motorSpeed: 75,
    currentRpm: 1200,
    fanStatus: 'active', // 'active', 'inactive'
    estimatedDryingTime: '1h 45m',
    weatherAlert: {
      active: true,
      message: 'Rain expected in 2 hours - Consider adjusting drying schedule'
    }
  }
  
  // Moisture level history data
  export const moistureData = [
    { time: '08:00', value: 24.5 },
    { time: '09:00', value: 22.1 },
    { time: '10:00', value: 19.8 },
    { time: '11:00', value: 18.3 },
    { time: '12:00', value: 16.9 },
    { time: '13:00', value: 15.4 },
    { time: '14:00', value: 14.2 },
  ]
  
  // Temperature and humidity history data
  export const environmentData = [
    { time: '08:00', temperature: 55.2, humidity: 52 },
    { time: '09:00', temperature: 58.7, humidity: 50 },
    { time: '10:00', temperature: 61.4, humidity: 48 },
    { time: '11:00', temperature: 63.9, humidity: 46 },
    { time: '12:00', temperature: 65.1, humidity: 44 },
    { time: '13:00', temperature: 65.5, humidity: 43 },
    { time: '14:00', temperature: 65.8, humidity: 42 },
  ]
  
  // Mock notifications
  export const notifications = [
    {
      id: 'n1',
      type: 'warning',
      message: 'Weather alert: Rain expected in 2 hours',
      time: '14:15 PM',
      read: false
    },
    {
      id: 'n2',
      type: 'info',
      message: 'Drying batch #2453 started',
      time: '08:00 AM',
      read: true
    },
    {
      id: 'n3',
      type: 'success',
      message: 'Drying batch #2452 completed successfully',
      time: 'Yesterday, 17:30 PM',
      read: true
    },
    {
      id: 'n4',
      type: 'error',
      message: 'System error: Fan speed reduced due to voltage fluctuation',
      time: 'Yesterday, 14:22 PM',
      read: true
    }
  ]
  
  // Work logs
  export const workLogs = [
    {
      id: 'wl1',
      date: '2023-08-10',
      shift: 'Morning',
      operator: 'John Doe',
      batches: [
        { id: 'B2453', startTime: '08:00', endTime: '15:45', status: 'completed', initialMoisture: 24.5, finalMoisture: 12.1 }
      ],
      notes: 'Regular operation, no issues'
    },
    {
      id: 'wl2',
      date: '2023-08-09',
      shift: 'Afternoon',
      operator: 'Jane Smith',
      batches: [
        { id: 'B2452', startTime: '12:30', endTime: '17:30', status: 'completed', initialMoisture: 23.8, finalMoisture: 12.3 }
      ],
      notes: 'Fan needed cleaning at 14:00, caused 15min downtime'
    },
    {
      id: 'wl3',
      date: '2023-08-09',
      shift: 'Morning',
      operator: 'Mike Johnson',
      batches: [
        { id: 'B2451', startTime: '08:15', endTime: '12:00', status: 'completed', initialMoisture: 22.9, finalMoisture: 12.0 }
      ],
      notes: 'Normal operation'
    }
  ]
  
  // User profile
  export const userProfile = {
    id: 'user123',
    name: 'Tashen Chamika',
    role: 'System Operator',
    shift: 'Morning (6:00 - 14:00)',
    contactNumber: '+1 555-123-4567',
    email: 'tashenchamika@cocopro.example',
    profileImage: 'https://randomuser.me/api/portraits/men/35.jpg'
  }
  // src/utils/mockData.js
export const rpmData = [
  { rpm: 1150, timestamp: new Date(Date.now() - 3600000) },
  { rpm: 1170, timestamp: new Date(Date.now() - 3000000) },
  // Add more mock data points...
];

