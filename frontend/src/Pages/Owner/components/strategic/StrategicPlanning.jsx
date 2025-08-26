import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { marketTrendData, competitorData } from '../../utils/mockData';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

export const StrategicPlanning = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Strategic Planning</h1>
        <p className="text-gray-500">
          Market analysis and growth opportunities
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Market Growth Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="domestic"
                  name="Domestic Market"
                  stroke="#0088FE"
                  activeDot={{
                    r: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="export"
                  name="Export Market"
                  stroke="#00C49F"
                />
                <Line
                  type="monotone"
                  dataKey="industry"
                  name="Industry Average"
                  stroke="#FF8042"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Competitor Analysis
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={competitorData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="marketShare"
                  name="Market Share (%)"
                  fill="#0088FE"
                />
                <Bar dataKey="growth" name="Growth Rate (%)" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Growth Opportunities
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Expand Export Markets
                </h3>
                <p className="text-sm text-gray-500">
                  Southeast Asian markets showing 12% annual growth
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Product Diversification
                </h3>
                <p className="text-sm text-gray-500">
                  Coconut-based bioplastics growing at 15% CAGR
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Vertical Integration
                </h3>
                <p className="text-sm text-gray-500">
                  Opportunity to acquire supplier with 22% ROI potential
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Sustainable Packaging
                </h3>
                <p className="text-sm text-gray-500">
                  Premium pricing potential with 18% margin increase
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <Target size={20} className="text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Business Goals
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Increase Production Capacity
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: '75%',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Current: 1,250 kg/day</span>
                  <span className="text-gray-800">Target: 2,000 kg/day</span>
                </div>
              </div>
            </li>
            <li className="flex items-start mt-4">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Expand Market Share
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: '60%',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Current: 28%</span>
                  <span className="text-gray-800">Target: 35%</span>
                </div>
              </div>
            </li>
            <li className="flex items-start mt-4">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Reduce Energy Consumption
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: '40%',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Current: -12%</span>
                  <span className="text-gray-800">Target: -30%</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <Award size={20} className="text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Competitive Analysis
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                outerRadius={90}
                data={competitorData.filter((item) => item.name !== 'Others')}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Market Share"
                  dataKey="marketShare"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Growth"
                  dataKey="growth"
                  stroke="#00C49F"
                  fill="#00C49F"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Efficiency"
                  dataKey="efficiency"
                  stroke="#FFBB28"
                  fill="#FFBB28"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center mb-4">
          <Users size={20} className="text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Industry Benchmarking
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CocoPro
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Industry Avg
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Market Share</td>
                <td className="px-6 py-4 text-sm text-gray-900">28%</td>
                <td className="px-6 py-4 text-sm text-gray-900">25%</td>
                <td className="px-6 py-4 text-sm text-green-600">Above Avg</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Growth Rate</td>
                <td className="px-6 py-4 text-sm text-gray-900">15%</td>
                <td className="px-6 py-4 text-sm text-gray-900">12%</td>
                <td className="px-6 py-4 text-sm text-green-600">Above Avg</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Efficiency</td>
                <td className="px-6 py-4 text-sm text-gray-900">85%</td>
                <td className="px-6 py-4 text-sm text-gray-900">80%</td>
                <td className="px-6 py-4 text-sm text-green-600">Above Avg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
