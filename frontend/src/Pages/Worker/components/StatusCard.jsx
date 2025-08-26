import React from 'react';

const StatusCard = ({ 
  title, 
  value, 
  icon, 
  status = 'normal', 
  suffix = '', 
  onClick, 
  clickable = false 
}) => {
  const statusColors = {
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
  };

  const iconColors = {
    normal: 'bg-blue-100 text-blue-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600',
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${statusColors[status]} shadow-sm ${
        clickable ? 'cursor-pointer hover:bg-opacity-70 transition-colors' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${iconColors[status]}`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-end">
            <span className="text-2xl font-bold">{value}</span>
            {suffix && <span className="ml-1 text-sm text-gray-600">{suffix}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard ;