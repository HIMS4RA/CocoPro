import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const FinishedProductGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyProduction();
  }, []);

  const fetchDailyProduction = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/finished-products/daily-production");
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching finished product data", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5 text-blue-500">📊 Loading production data...</div>;
  if (error) return <div className="text-center py-5 text-red-600">❌ Error: {error}</div>;

  return (
    <div className="w-full h-[320px] px-4 sm:px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📦 Daily Finished Product Production
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            label={{ value: "Date", offset: -5, position: "insideBottomRight" }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            label={{ value: "Quantity (kg/units)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", fontSize: "0.85rem" }}
            formatter={(value, name) => [`${value}`, name]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: "0.85rem" }} />

          <Line
            type="monotone"
            dataKey="producedQuantity"
            name="Produced Quantity"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />

          <Line
            type="monotone"
            dataKey="quantityUsed"
            name="Used Raw Material"
            stroke="#6366f1"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="quantityWasted"
            name="Wasted Material"
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinishedProductGraph;
