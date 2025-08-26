import React from 'react';
import {
  DropletIcon,
  PackageIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import Card from '../components/UI/Card';
import StatCard from '../components/UI/StatCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Drying Efficiency"
          value="94.2%"
          icon={<DropletIcon size={24} className="text-blue-500" />}
          trend={{
            value: 3.2,
            isPositive: true,
          }}
        />
        <StatCard
          title="Current Stock"
          value="12.4 tons"
          icon={<PackageIcon size={24} className="text-green-500" />}
          trend={{
            value: 2.1,
            isPositive: true,
          }}
        />
        <StatCard
          title="Energy Usage"
          value="426 kWh"
          icon={<TrendingUpIcon size={24} className="text-yellow-500" />}
          trend={{
            value: 1.5,
            isPositive: false,
          }}
        />
        <StatCard
          title="Safety Incidents"
          value="0"
          icon={<AlertCircleIcon size={24} className="text-red-500" />}
        />
        <StatCard
          title="Production Rate"
          value="2.8 t/hr"
          icon={<TrendingUpIcon size={24} className="text-purple-500" />}
          trend={{
            value: 4.7,
            isPositive: true,
          }}
        />
        <StatCard
          title="Active Workers"
          value="18"
          icon={<UsersIcon size={24} className="text-indigo-500" />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Drying Efficiency Trend">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Efficiency Chart (Last 30 Days)</p>
          </div>
        </Card>
        <Card title="Energy Consumption">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Energy Usage Chart (Last 30 Days)</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card title="Recent Alerts">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex-1">
                <p className="font-medium text-yellow-700">
                  Maintenance Required
                </p>
                <p className="text-sm text-yellow-600">
                  Dryer Unit 2 needs maintenance check
                </p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex-1">
                <p className="font-medium text-blue-700">Inventory Update</p>
                <p className="text-sm text-blue-600">
                  Raw material delivery scheduled for tomorrow
                </p>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex-1">
                <p className="font-medium text-green-700">
                  Production Goal Achieved
                </p>
                <p className="text-sm text-green-600">
                  Monthly production target reached
                </p>
              </div>
              <span className="text-xs text-gray-500">Yesterday</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
