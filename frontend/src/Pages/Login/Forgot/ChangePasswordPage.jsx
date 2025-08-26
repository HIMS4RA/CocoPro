import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LockIcon } from 'lucide-react';
import { ForgotLayout } from './ForgotLayout';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


export function ChangePasswordPage({ onBack }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
  
    // Retrieve the email from navigation state
    const email = location.state?.email;
  
    console.log("Email received in ChangePasswordPage:", email); // Debugging log
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      if (!email) {
        setError("Email is missing. Please restart the password reset process.");
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:8080/api/change-password", { 
          email, 
          password 
        });
  
        console.log("Password reset response:", response.data); // Debugging log
        navigate("/login");
      } catch (err) {
        setError("Password reset failed");
      }
  };

  return (
    <ForgotLayout onBack={onBack} title="Set New Password">
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="newPassword"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 py-2 px-4 border"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 py-2 px-4 border"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <div>{error}</div>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Save New Password
        </button>
      </form>
    </ForgotLayout>
  );
}

ChangePasswordPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};
