import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../Manager/components/UI/Card'; // Adjust path if needed
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import axios from 'axios';

export const AddUserModal = () => {
  const [worker, setWorker] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    joinDate: '',
    address: '',
    notes: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setWorker((prevWorker) => ({ ...prevWorker, joinDate: today }));
  }, []);

  // Handle key press to block numbers and special characters in name fields
  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.keyCode || e.which);
    const nameRegex = /^[A-Za-z\s-']$/; // Allow letters, spaces, hyphens, and apostrophes
    if (!nameRegex.test(char)) {
      e.preventDefault();
    }
  };

  // Handle key press to block letters in phone number field
  const handlePhoneKeyPress = (e) => {
    const char = String.fromCharCode(e.keyCode || e.which);
    const phoneCharRegex = /^[\d-]$/; // Allow only digits and hyphens
    if (!phoneCharRegex.test(char)) {
      e.preventDefault();
    }
  };

  // Handle input changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker((prev) => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };

    // Real-time validation for firstName and lastName
    const nameRegex = /^[A-Za-z\s-']*$/;
    if (name === 'firstName' || name === 'lastName') {
      if (value && !nameRegex.test(value)) {
        newErrors[name] = `${
          name === 'firstName' ? 'First' : 'Last'
        } name can only contain letters, spaces, hyphens, or apostrophes`;
      } else if (!value.trim()) {
        newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
      } else {
        delete newErrors[name];
      }
    }

    // Real-time validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    }

    // Real-time validation for phoneNumber
    const phoneRegex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
    if (name === 'phoneNumber') {
      if (value && !phoneRegex.test(value)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits or XXX-XXX-XXXX';
      } else {
        delete newErrors.phoneNumber;
      }
    }

    // Real-time validation for role
    if (name === 'role') {
      if (!value.trim()) {
        newErrors.role = 'Role is required';
      } else {
        delete newErrors.role;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name: Required and no numbers/special characters
    const nameRegex = /^[A-Za-z\s-']*$/;
    if (!worker.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!nameRegex.test(worker.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, or apostrophes';
    }

    // Last Name: Required and no numbers/special characters
    if (!worker.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!nameRegex.test(worker.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, or apostrophes';
    }

    // Email: Required and valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!worker.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(worker.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone Number: Optional, but if provided, must match format
    const phoneRegex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
    if (worker.phoneNumber && !phoneRegex.test(worker.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits or XXX-XXX-XXXX';
    }

    // Role: Required
    if (!worker.role.trim()) {
      newErrors.role = 'Role is required';
    }

    // Join Date: Required (set by useEffect, but ensure it’s not tampered with)
    if (!worker.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation errors:', errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/workers', worker);
      setMessage('User added successfully! Login details have been emailed.');
      setWorker({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        joinDate: new Date().toISOString().split('T')[0],
        address: '',
        notes: '',
        role: '',
      });
      setErrors({});
    } catch (error) {
      setMessage('Error adding worker.');
      console.error('Error adding worker:', error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link
          to="/owner/users"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Users
        </Link>
      </div>

      {message && (
        <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <Card title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`mt-1 block w-full border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="First Name"
                value={worker.firstName}
                onChange={handleChange}
                onKeyPress={handleNameKeyPress} // Block invalid characters
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`mt-1 block w-full border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="Last Name"
                value={worker.lastName}
                onChange={handleChange}
                onKeyPress={handleNameKeyPress} // Block invalid characters
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                className={`mt-1 block w-full border ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                value={worker.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Worker">Worker</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`mt-1 block w-full border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="email@example.com"
                value={worker.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={`mt-1 block w-full border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="(123) 456-7890"
                value={worker.phoneNumber}
                onChange={handleChange}
                onKeyPress={handlePhoneKeyPress} // Block letters and invalid characters
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                Join Date
              </label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                className={`mt-1 block w-full border ${
                  errors.joinDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                value={worker.joinDate}
                onChange={handleChange}
                readOnly
              />
              {errors.joinDate && (
                <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Worker's address"
              value={worker.address}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Any additional information about the worker"
              value={worker.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <Link
              to="/owner/users"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
            >
              <SaveIcon size={16} className="mr-2" />
              Save Worker
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddUserModal;