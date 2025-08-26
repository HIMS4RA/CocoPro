import React, { useState, useEffect } from 'react';
import { UserTable } from './UserTable';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, PieChart, Search, X, Edit, Trash2 } from 'lucide-react';
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import axios from 'axios';

// Create a custom axios instance with error handling
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Add interceptor to suppress 404 error messages in console
api.interceptors.response.use(
  response => response,
  error => {
    // If endpoint is not found, handle it silently without console errors
    if (error.response && error.response.status === 404) {
      return Promise.resolve({ data: [], status: 404 });
    }
    return Promise.reject(error);
  }
);

export const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [staffDistribution, setStaffDistribution] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    role: '',
    department: '',
  });

  // Mock data for development
  const mockUsers = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      name: 'John Doe', 
      role: 'Manager', 
      department: 'Operations', 
      status: 'Active' 
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      name: 'Jane Smith', 
      role: 'Supervisor', 
      department: 'Production', 
      status: 'Inactive' 
    },
    { 
      id: 3, 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      name: 'Bob Johnson', 
      role: 'Worker', 
      department: 'Production', 
      status: 'Active' 
    },
    { 
      id: 4, 
      firstName: 'Alice', 
      lastName: 'Williams', 
      name: 'Alice Williams', 
      role: 'Worker', 
      department: 'Packaging', 
      status: 'Active' 
    },
    { 
      id: 5, 
      firstName: 'Michael', 
      lastName: 'Brown', 
      name: 'Michael Brown', 
      role: 'Supervisor', 
      department: 'Maintenance', 
      status: 'Inactive' 
    }
  ];

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Try to fetch from API
        const response = await api.get('/api/workers', {
          withCredentials: true,
        });
        
        if (response.status === 404) {
          // API endpoint not found, use mock data
          processUsers(mockUsers);
          return;
        }
        
        // If successful, use the API data
        const fetchedUsers = response.data.map((user) => ({
          id: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          name: `${user.firstName} ${user.lastName}`,
          role: user.role || 'Worker',
          department: user.department || 'Not specified',
          // Randomize active status for demonstration until backend has active tracking
          status: Math.random() > 0.3 ? 'Active' : 'Inactive',
        }));
        processUsers(fetchedUsers);
      } catch (err) {
        // Silently fallback to mock data
        processUsers(mockUsers);
      }
    };

    // Process users (either from API or mock)
    const processUsers = (userData) => {
      setUsers(userData);

      // Calculate staff distribution
      const distribution = [
        { role: 'Worker', count: 0 },
        { role: 'Supervisor', count: 0 },
        { role: 'Manager', count: 0 },
      ];
      
      userData.forEach((user) => {
        const roleIndex = distribution.findIndex((d) => d.role === user.role);
        if (roleIndex !== -1) {
          distribution[roleIndex].count += 1;
        }
      });
      
      setStaffDistribution(distribution.filter((d) => d.count > 0));
      setLoading(false);
    };

    fetchUsers();
    
    // Simulate status changes periodically
    const intervalId = setInterval(() => {
      simulateStatusChanges();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Simulate status changes until backend supports it
  const simulateStatusChanges = () => {
    setUsers(prevUsers => prevUsers.map(user => ({
      ...user,
      status: Math.random() > 0.3 ? 'Active' : 'Inactive'
    })));
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department
    });
    setShowEditModal(true);
  };
  
  // Handle closing the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentUser(null);
  };
  
  // Handle input changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    
    // For first name and last name fields, only allow letters and spaces
    if (name === 'firstName' || name === 'lastName') {
      // Only allow letters and spaces
      const lettersAndSpacesOnly = /^[A-Za-z\s]*$/;
      if (value === '' || lettersAndSpacesOnly.test(value)) {
        setEditForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
      // If invalid input, don't update state
    } else {
      // For other fields, update normally
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle saving edited user
  const handleSaveUser = async () => {
    try {
      if (!currentUser) return;
      
      // Validate form
      const nameRegex = /^[A-Za-z\s]+$/;
      const validationErrors = [];
      
      if (!editForm.firstName.trim()) {
        validationErrors.push('First name is required');
      } else if (!nameRegex.test(editForm.firstName)) {
        validationErrors.push('First name should only contain letters and spaces');
      }
      
      if (!editForm.lastName.trim()) {
        validationErrors.push('Last name is required');
      } else if (!nameRegex.test(editForm.lastName)) {
        validationErrors.push('Last name should only contain letters and spaces');
      }
      
      if (!editForm.role) {
        validationErrors.push('Role is required');
      }
      
      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }
      
      // Prepare updated user data
      const updatedUserData = {
        id: currentUser.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        role: editForm.role,
        department: editForm.department
      };
      
      try {
        // Try to update via API first, using the custom api instance
        await api.put(`/api/workers/${currentUser.id}`, updatedUserData, {
          withCredentials: true,
        });
      } catch (apiError) {
        // API isn't available, just continue with local update silently
      }
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            name: `${editForm.firstName} ${editForm.lastName}`,
            role: editForm.role,
            department: editForm.department
          };
        }
        return user;
      }));
      
      // Close modal
      setShowEditModal(false);
      setCurrentUser(null);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  // Filter users based on role and search query
  const filteredUsers = users
    .filter(user => filterRole === 'All' || user.role === filterRole)
    .filter(user => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage workers, supervisors, and managers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Users size={20} className="text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Staff Overview</h2>
            </div>
            <button
              onClick={() => navigate('/owner/add-user')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <UserPlus size={16} className="mr-2" />
              Add User
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center mb-4 justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Filter by role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="All">All Roles</option>
                <option value="Worker">Workers</option>
                <option value="Supervisor">Supervisors</option>
                <option value="Manager">Managers</option>
              </select>
            </div>
            
            {/* Search input */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-500">Active (Logged In)</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-300 mr-1"></div>
              <span className="text-xs text-gray-500">Inactive</span>
            </div>
          </div>
          
          <UserTable users={filteredUsers} onEditUser={handleEditUser} />
          
          {filteredUsers.length === 0 && searchQuery && (
            <div className="text-center py-4 text-gray-500">
              No users found matching "{searchQuery}".
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <PieChart size={20} className="text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Staff Distribution</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={staffDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="role"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {staffDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {staffDistribution.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-xs text-gray-500">(letters only)</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={editForm.firstName}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-xs text-gray-500">(letters only)</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={editForm.lastName}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={editForm.role}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Worker">Worker</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={editForm.department}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};