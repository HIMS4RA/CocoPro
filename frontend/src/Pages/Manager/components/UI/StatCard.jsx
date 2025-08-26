import React from 'react';

const StatCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend && (
            <div
              className={`flex items-center mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              <span className="text-xs font-medium">
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                from last month
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
