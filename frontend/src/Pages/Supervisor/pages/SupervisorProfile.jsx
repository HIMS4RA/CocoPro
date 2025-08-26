import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  SettingsIcon,
  SaveIcon,
  LogOutIcon,
} from 'lucide-react';
import axios from 'axios';

const SupervisorProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    department: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true,
        });

        console.log('Raw response from /auth/me:', response.data);

        if (response.data.message === 'Not logged in') {
          window.location.href = 'http://localhost:5173';
          return;
        }

        setUserData(response.data);
        const newFormData = {
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          role: response.data.role || '',
          department: response.data.department || 'Not specified',
          bio: response.data.bio || '',
        };
        console.log('Setting formData:', newFormData);
        setFormData(newFormData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        setLoading(false);
        if (error.response?.status === 401 || error.response?.data?.message === 'Not logged in') {
          window.location.href = 'http://localhost:5173';
        }
      }
    };

    fetchUserData();
  }, []);

  // Handle key press to block invalid characters
  const handleKeyPress = (e, fieldType) => {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (fieldType === 'name') {
      const nameRegex = /^[A-Za-z\s-']$/; // Letters, spaces, hyphens, apostrophes
      if (!nameRegex.test(char)) {
        e.preventDefault();
      }
    } else if (fieldType === 'phone') {
      const phoneRegex = /^[\d-]$/; // Digits and hyphens only
      if (!phoneRegex.test(char)) {
        e.preventDefault();
      }
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    let newErrors = { ...errors };
    const nameRegex = /^[A-Za-z\s-']*$/;
    const phoneRegex = /^[\d-]*$/; // Allow digits and hyphens only
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (id === 'firstName' || id === 'lastName') {
      if (value && !nameRegex.test(value)) {
        newErrors[id] = `${id === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, or apostrophes`;
      } else if (!value.trim()) {
        newErrors[id] = `${id === 'firstName' ? 'First' : 'Last'} name is required`;
      } else {
        delete newErrors[id];
      }
    }

    if (id === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    }

    if (id === 'phoneNumber') {
      if (value && !phoneRegex.test(value)) {
        newErrors.phoneNumber = 'Phone number can only contain digits and hyphens';
      } else if (value && !/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(value)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits or XXX-XXX-XXXX';
      } else {
        delete newErrors.phoneNumber;
      }
    }

    if (id === 'role' && !value.trim()) {
      newErrors.role = 'Role is required';
    } else if (id === 'role') {
      delete newErrors.role;
    }

    setErrors(newErrors);
  };

  // Validation rules for form submission
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s-']*$/;
    const phoneRegex = /^[\d-]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First Name: Required, no numbers/special characters
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, or apostrophes';
    }

    // Last Name: Required, no numbers/special characters
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, or apostrophes';
    }

    // Email: Required and valid format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone Number: Optional, but if provided, must be digits/hyphens and match format
    if (formData.phoneNumber) {
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number can only contain digits and hyphens';
      } else if (!/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits or XXX-XXX-XXXX';
      }
    }

    // Role: Required
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    if (!validateForm()) {
      console.log('Validation errors:', errors);
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/api/user/update', formData, {
        withCredentials: true,
      });
      console.log('Response from server:', response.data);
      alert('Personal information updated successfully');
      setUserData((prev) => ({ ...prev, ...formData }));
    } catch (error) {
      console.error('Error updating personal information:', error.response?.data || error.message);
      alert('Failed to update personal information');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true,
      });
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Section */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon size={48} className="text-gray-500" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-sm text-gray-500">{userData.role}</p>
              <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Change Photo
              </button>
              <button
                onClick={handleLogout}
                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
              >
                <LogOutIcon size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
            <div className="mt-6 border-t pt-6">
              <nav className="space-y-1">
                {[
                  { name: 'Personal Information', icon: <UserIcon size={20} /> },
                  { name: 'Security', icon: <KeyIcon size={20} /> },
                  { name: 'Notifications', icon: <BellIcon size={20} /> },
                  { name: 'Settings', icon: <SettingsIcon size={20} /> },
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      index === 0 ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* Main Content Section */}
        <div className="md:col-span-3">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'name')}
                    className={`mt-1 block w-full border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'name')}
                    className={`mt-1 block w-full border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleKeyPress(e, 'phone')}
                    className={`mt-1 block w-full border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <SaveIcon size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          {/* Security Section */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <KeyIcon size={16} className="mr-2" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorProfile;