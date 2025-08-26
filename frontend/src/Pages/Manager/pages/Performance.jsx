import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';

const Performance = () => {
  const [data, setData] = useState([]); // Replace with actual data type or fetch logic

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const response = await fetch('/api/performance');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Overall Drying Efficiency">
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Efficiency Chart (Monthly Trend)</p>
          </div>
        </Card>
        <Card title="Production Output">
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Production Chart (Monthly Trend)</p>
          </div>
        </Card>
      </div>
      <Card title="Drying Cycle History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    CYC-{1000 + item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2023-07-{10 + item} 08:30
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2023-07-{10 + item} 14:45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    6h 15m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1,200
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1,140
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    95.0%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of 42 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm">Previous</button>
            <button className="px-3 py-1 border rounded bg-green-600 text-white text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm">2</button>
            <button className="px-3 py-1 border rounded text-sm">3</button>
            <button className="px-3 py-1 border rounded text-sm">Next</button>
          </div>
        </div>
      </Card>
      <Card title="Worker Productivity Insights">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Worker Productivity Chart</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Team A</h4>
                <span className="text-green-600 text-sm font-medium">98.2% Efficiency</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.2%' }}></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Team B</h4>
                <span className="text-green-600 text-sm font-medium">94.5% Efficiency</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Team C</h4>
                <span className="text-yellow-600 text-sm font-medium">87.3% Efficiency</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87.3%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Performance;
