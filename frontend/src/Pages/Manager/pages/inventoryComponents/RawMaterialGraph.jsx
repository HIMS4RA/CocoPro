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

const RawMaterialGraph = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyQuantities();
  }, []);

  const fetchDailyQuantities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/raw-materials/daily-quantities");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching chart data", err);
      setError("Failed to load raw material data.");
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] px-4 sm:px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        🥥 Daily Raw Material Overview
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
            label={{ value: "Date", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            label={{ value: "Kilograms (kg)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", fontSize: "0.85rem" }}
            formatter={(value, name) => [`${value} kg`, name === "dailyAdded" ? "Daily Added" : "Current Stock"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: "0.85rem" }} />

          {/* Daily Added Line */}
          <Line
            type="monotone"
            dataKey="dailyAdded"
            name="Daily Added"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />

          {/* Current Stock Line */}
          <Line
            type="monotone"
            dataKey="currentStock"
            name="Current Stock"
            stroke="#34d399"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RawMaterialGraph;
