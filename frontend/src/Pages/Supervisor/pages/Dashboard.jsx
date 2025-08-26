import React, { useState } from 'react'
import {
  ThermometerIcon,
  DropletIcon,
  FanIcon,
  UsersIcon,
  CloudRainIcon,
} from 'lucide-react'
import StatusCard from '../components/StatusCard'
import DryingStationCard from '../components/DryingStationCard'
import AlertBanner from '../components/AlertBanner'

const Dashboard = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'High humidity detected in Station 3. Check ventilation.',
    },
    {
      id: 2,
      type: 'info',
      message: 'Weather forecast: Rain expected in 2 hours. Consider adjustments.',
    },
  ])

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const dryingStations = [
    {
      id: 1,
      name: 'Drying Station 1',
      temperature: 65,
      humidity: 30,
      fanSpeed: 1200,
      status: 'operational',
      operator: 'John Smith',
    },
    {
      id: 2,
      name: 'Drying Station 2',
      temperature: 68,
      humidity: 28,
      fanSpeed: 1150,
      status: 'operational',
      operator: 'Maria Garcia',
    },
    {
      id: 3,
      name: 'Drying Station 3',
      temperature: 71,
      humidity: 45,
      fanSpeed: 1300,
      status: 'warning',
      operator: 'David Chen',
    },
    {
      id: 4,
      name: 'Drying Station 4',
      temperature: 62,
      humidity: 32,
      fanSpeed: 1050,
      status: 'maintenance',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        {alerts.map((alert) => (
          <AlertBanner
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onDismiss={() => dismissAlert(alert.id)}
          />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="Average Temperature"
            value="66.5°C"
            icon={<ThermometerIcon className="h-6 w-6 text-red-500" />}
            color="#ef4444"
          />
          <StatusCard
            title="Average Humidity"
            value="33.8%"
            icon={<DropletIcon className="h-6 w-6 text-blue-500" />}
            color="#3b82f6"
          />
          <StatusCard
            title="Active Workers"
            value="8"
            icon={<UsersIcon className="h-6 w-6 text-green-500" />}
            color="#22c55e"
          />
          <StatusCard
            title="Weather Impact"
            value="Moderate"
            icon={<CloudRainIcon className="h-6 w-6 text-purple-500" />}
            color="#8b5cf6"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Drying Stations</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            All Controls
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dryingStations.map((station) => (
            <DryingStationCard key={station.id} {...station} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
