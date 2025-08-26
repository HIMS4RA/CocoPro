import React from 'react'

const StatusCard = ({ title, value, icon, color }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-5 border-l-4 flex justify-between items-center"
      style={{
        borderLeftColor: color,
      }}
    >
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div
        className="rounded-full p-3"
        style={{
          backgroundColor: `${color}20`,
        }}
      >
        {icon}
      </div>
    </div>
  )
}

export default StatusCard
