import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { KPICard } from '../dashboard/KPICard';
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUp,
} from 'lucide-react';
import { revenueData, forecastData, costBreakdown } from '../../utils/mockData';

export const FinancialManagement = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  // Combine historical and forecast data
  const combinedData = [...revenueData, ...forecastData];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Financial Management
        </h1>
        <p className="text-gray-500">Analyze revenue, costs, and investments</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="Total Revenue (YTD)"
          value="$297,000"
          change={12.5}
          icon={<DollarSign size={24} className="text-green-600" />}
        />
        <KPICard
          title="Total Costs (YTD)"
          value="$183,000"
          change={5.2}
          icon={<DollarSign size={24} className="text-green-600" />}
        />
        <KPICard
          title="Net Profit (YTD)"
          value="$114,000"
          change={18.3}
          icon={<TrendingUp size={24} className="text-green-600" />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Revenue & Forecast
            </h2>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-500 mr-3">Actual</span>
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-500">Forecast</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.month === 'Jun') {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill="#0088FE"
                          stroke="white"
                          strokeWidth={2}
                        />
                      );
                    }
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={
                          revenueData.includes(payload) ? '#0088FE' : '#00C49F'
                        }
                      />
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={
                          revenueData.includes(payload) ? '#00C49F' : '#00C49F'
                        }
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Cost Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Investment & ROI Analysis
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Equipment',
                    investment: 120000,
                    roi: 18,
                  },
                  {
                    name: 'Technology',
                    investment: 85000,
                    roi: 22,
                  },
                  {
                    name: 'Marketing',
                    investment: 45000,
                    roi: 15,
                  },
                  {
                    name: 'Training',
                    investment: 25000,
                    roi: 12,
                  },
                  {
                    name: 'R&D',
                    investment: 35000,
                    roi: 8,
                  },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" unit="%" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="investment"
                  name="Investment ($)"
                  fill="#0088FE"
                />
                <Bar
                  yAxisId="right"
                  dataKey="roi"
                  name="ROI (%)"
                  fill="#00C49F"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payroll & HR Expenditure
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    department: 'Production',
                    salary: 45000,
                    benefits: 12000,
                    training: 5000,
                  },
                  {
                    department: 'Maintenance',
                    salary: 28000,
                    benefits: 8000,
                    training: 3000,
                  },
                  {
                    department: 'Quality',
                    salary: 32000,
                    benefits: 9000,
                    training: 4000,
                  },
                  {
                    department: 'Admin',
                    salary: 25000,
                    benefits: 7000,
                    training: 2000,
                  },
                  {
                    department: 'Management',
                    salary: 38000,
                    benefits: 11000,
                    training: 6000,
                  },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="salary"
                  name="Salaries"
                  stackId="a"
                  fill="#0088FE"
                />
                <Bar
                  dataKey="benefits"
                  name="Benefits"
                  stackId="a"
                  fill="#00C49F"
                />
                <Bar
                  dataKey="training"
                  name="Training"
                  stackId="a"
                  fill="#FFBB28"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
