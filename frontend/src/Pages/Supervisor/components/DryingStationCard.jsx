import React from 'react'
import { ThermometerIcon, FanIcon, DropletIcon } from 'lucide-react'

const statusColors = {
  operational: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  maintenance: 'bg-blue-500',
}

const statusText = {
  operational: 'Operational',
  warning: 'Warning',
  critical: 'Critical',
  maintenance: 'Maintenance',
}

const DryingStationCard = ({ id, name, temperature, humidity, fanSpeed, status, operator }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{name}</h3>
          <div className={`px-3 py-1 rounded-full text-white text-xs ${statusColors[status]}`}>
            {statusText[status]}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <ThermometerIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-gray-600">Temperature:</span>
            <span className="ml-auto font-medium">{temperature}°C</span>
          </div>
          <div className="flex items-center">
            <DropletIcon className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">Humidity:</span>
            <span className="ml-auto font-medium">{humidity}%</span>
          </div>
          <div className="flex items-center">
            <FanIcon className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">Fan Speed:</span>
            <span className="ml-auto font-medium">{fanSpeed} RPM</span>
          </div>
        </div>
        {operator && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Current Operator: <span className="font-medium text-gray-700">{operator}</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between">
        <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
        <button className="text-sm text-green-600 hover:text-green-800">Controls</button>
      </div>
    </div>
  )
}

export default DryingStationCard
