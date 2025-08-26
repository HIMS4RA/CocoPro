import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  change,
  icon,
  prefix = '',
  suffix = '',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-800">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </h3>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive && (
                <span className="flex items-center text-green-600 text-sm">
                  <TrendingUp size={16} className="mr-1" />+{change}%
                </span>
              )}
              {isNegative && (
                <span className="flex items-center text-red-600 text-sm">
                  <TrendingDown size={16} className="mr-1" />
                  {change}%
                </span>
              )}
              {!isPositive && !isNegative && (
                <span className="text-gray-500 text-sm">0%</span>
              )}
              <span className="text-gray-500 text-xs ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-2 bg-green-50 rounded-md">{icon}</div>
      </div>
    </div>
  );
};
