import React from 'react';
import { CheckCircleIcon, XIcon } from 'lucide-react';

export const TaskCompleteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-[fadeIn_0.3s_ease-in-out]">
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Task Complete</h2>
          </div>
          <button
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800">
              Target Moisture Level Reached!
            </h3>
          </div>
          <p className="text-gray-700 mb-6 text-center">
            The system has been shut down automatically as the target moisture level has been achieved.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompleteModal;