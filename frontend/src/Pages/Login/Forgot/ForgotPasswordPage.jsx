import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MailIcon } from 'lucide-react';
import { ForgotLayout } from './ForgotLayout';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ForgotPasswordPage({ onBack }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:8080/api/forgot-password", { email });
          console.log("Email sent to backend:", email); // Debugging log
          navigate("/verify-otp", { state: { email } });
        } catch (err) {
          setError("Email not found");
        }
      };

  return (
    <ForgotLayout
      onBack={onBack}
      title="Reset Password"
      description="Enter your email address and we'll send you an OTP to reset your password."
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 py-2 px-4 border"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div>{error}</div>}
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Send OTP
        </button>
      </form>
    </ForgotLayout>
  );
}

ForgotPasswordPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
