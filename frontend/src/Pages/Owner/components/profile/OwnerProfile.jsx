import React, { useState, useEffect } from 'react';
import {
  User,
  Key,
  Settings,
  Save,
  LogOut,
  Briefcase,
  Mail,
  Phone,
  Building,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const OwnerProfile = () => {
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
  const [activeTab, setActiveTab] = useState('personal');

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
          department: response.data.department || 'Management',
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // For first name and last name fields, only allow letters and spaces
    if (id === 'firstName' || id === 'lastName') {
      // Only allow letters and spaces
      const lettersAndSpacesOnly = /^[A-Za-z\s]*$/;
      if (value === '' || lettersAndSpacesOnly.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
      // If invalid input, don't update state
    } else {
      // For other fields, update normally
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name should only contain letters and spaces';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Last name should only contain letters and spaces';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.role.trim()) newErrors.role = 'Role is required';

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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 flex items-center">
        <AlertCircle className="mr-2" />
        No user data available. Please log in again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'personal'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'security'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'personal' ? (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={40} className="text-gray-500" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-500">{userData.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-xs text-gray-500">(letters only)</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-xs text-gray-500">(letters only)</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                      <Phone size={16} />
                    </div>
                    <input
                      type="text"
                      id="phoneNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="text"
                      id="role"
                      className={`w-full px-3 py-2 border ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      } rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                      value={formData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                      <Building size={16} />
                    </div>
                    <input
                      type="text"
                      id="department"
                      className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description about yourself"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="flex">
                      <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        <Key size={16} />
                      </div>
                      <input
                        type="password"
                        id="currentPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="flex">
                      <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        <Key size={16} />
                      </div>
                      <input
                        type="password"
                        id="newPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="flex">
                      <div className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                        <Key size={16} />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile; 