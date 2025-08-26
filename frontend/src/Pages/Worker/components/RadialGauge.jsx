import React from 'react'

const RadialGauge = ({ 
  value, 
  min = 0, 
  max = 100, 
  width = 200, 
  height = 200, 
  label = '', 
  units = '', 
  colorRanges = [{ min: 0, max: 100, color: '#3b82f6' }]
}) => {
  const radius = Math.min(width, height) / 2 - 10
  const centerX = width / 2
  const centerY = height / 2
  const strokeWidth = 20
  const circumference = 2 * Math.PI * radius
  
  const percentage = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const dashOffset = circumference * (1 - percentage)
  
  const getColor = () => {
    for (const range of colorRanges) {
      if (value >= range.min && value <= range.max) {
        return range.color
      }
    }
    return '#3b82f6'
  }
  
  return (
    <div className="text-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        />
        
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#111827"
        >
          {value}
        </text>
        <text
          x={centerX}
          y={centerY + 20}
          textAnchor="middle"
          fontSize="14"
          fill="#6b7280"
        >
          {units}
        </text>
      </svg>
      <div className="mt-2 text-sm font-medium text-gray-700">{label}</div>
    </div>
  )
}

export default RadialGauge;