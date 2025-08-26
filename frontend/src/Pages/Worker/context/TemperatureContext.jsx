// context/TemperatureContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { OutdentIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [temperature, setTemperature] = useState(0);
  const [isOverheating, setIsOverheating] = useState(false);

  const fetchTemperature = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sensor-data/latest");
      const latestTemperature = response.data.temperature;
      setTemperature(latestTemperature);

      console.log("Globle overheat" +isOverheating)


      if (latestTemperature > 35 && !isOverheating) {
        setIsOverheating(true);
      } else if (latestTemperature <= 35 && isOverheating) {
        setIsOverheating(false);
      }
    } catch (error) {
      console.error("Error fetching temperature:", error);
    } 
  };

  useEffect(() => {
    // Poll temperature every 5 seconds
    const interval = setInterval(fetchTemperature, 100000);
    return () => clearInterval(interval);
  }, [isOverheating]);

  return (
    <TemperatureContext.Provider value={{ temperature, isOverheating, setIsOverheating }}>
      {children}<Outlet />
    </TemperatureContext.Provider>
  );
};

export default TemperatureContext;