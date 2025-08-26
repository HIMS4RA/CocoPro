import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ForgotLayout } from './ForgotLayout';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export function VerifyOtpPage({ onBack }) {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
  
    // Retrieve email safely
    const email = location.state?.email;
  
    console.log("Email received in VerifyOtpPage:", email); // Debugging log
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!email) {
        setError("Email is missing. Please restart the process.");
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:8080/api/verify-otp", { email, otp });
        navigate("/change-password", { state: { email } });
      } catch (err) {
        setError("Invalid OTP");
      }
    };

  return (
    <ForgotLayout
      onBack={onBack}
      title="Enter OTP"
      description={`We've sent a one-time password to ${email}. Please enter it below.`}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            One-Time Password
          </label>
          <input
            type="text"
            id="otp"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 py-2 px-4 border"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
        </div>
        {error && <div>{error}</div>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Verify OTP
        </button>
      </form>
    </ForgotLayout>
  );
}

VerifyOtpPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};
