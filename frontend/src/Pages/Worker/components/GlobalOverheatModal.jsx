import React, { useContext, useState, useEffect } from 'react';
import TemperatureContext from '../context/TemperatureContext';
import { AlertTriangleIcon, XIcon, TimerIcon } from 'lucide-react';

const GlobalOverheatModal = () => {
  const { isOverheating, setIsOverheating } = useContext(TemperatureContext);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOverheating) {
      setCountdown(10); // Reset countdown to 10 seconds when the modal opens

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isOverheating]); // Only run this effect when isOverheating changes

  if (!isOverheating) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="bg-white w-full max-w-md shadow-lg rounded-lg animate-[slideIn_0.3s_ease-out]"
        style={{
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangleIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Critical Alert</h2>
          </div>
          <button
            onClick={() => setIsOverheating(false)}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800">
              ⚠️ Machine Overheating!
            </h3>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center justify-center space-x-2">
            <TimerIcon className="h-5 w-5 text-red-600 animate-pulse" />
            <span className="text-red-600 font-bold">
              Automatic shutdown in {countdown} seconds
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            Temperature has exceeded <span className="font-bold">35°C</span>.
          </p>
          <p className="text-gray-700 mb-6">
            The system has been shut down automatically to prevent damage.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <p className="text-sm text-yellow-700">
                Please ensure proper ventilation and check cooling systems
                before restarting.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsOverheating(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Acknowledge ({countdown}s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalOverheatModal;