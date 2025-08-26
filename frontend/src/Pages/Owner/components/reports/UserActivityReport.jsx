import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Users, 
  PieChart,
  User,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  BarChart2,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

export const UserDistributionReport = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Chart data
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [experienceDistribution, setExperienceDistribution] = useState([]);
  const [locationDistribution, setLocationDistribution] = useState([]);
  
  // Chart colors
  const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all workers
        const workersResponse = await axios.get('http://localhost:8080/api/workers', {
          withCredentials: true
        });
        
        console.log('Workers data:', workersResponse.data);
        
        // Get owner data
        const ownerResponse = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true
        });
        
        console.log('Owner data:', ownerResponse.data);
        
        // Create an array of all users
        let allUsers = [];
        
        // Add owner if it exists
        if (ownerResponse.data && typeof ownerResponse.data === 'object') {
          const ownerData = ownerResponse.data;
          // Format owner data
          const ownerObj = {
            id: ownerData.id || 'owner-id',
            firstName: ownerData.firstName || 'Owner',
            lastName: ownerData.lastName || 'User',
            role: ownerData.role || 'Owner',
            email: ownerData.email || 'owner@example.com',
            location: ownerData.location || 'Main Office',
            joinDate: ownerData.joinDate || new Date().toISOString().split('T')[0],
            status: 'Active',
            experience: calculateExperience(ownerData.joinDate)
          };
          
          allUsers.push(ownerObj);
        }
        
        // Add workers if they exist
        if (workersResponse.data && Array.isArray(workersResponse.data)) {
          // Format worker data consistently
          const formattedWorkers = workersResponse.data.map(worker => ({
            id: worker.id || worker._id || `worker-${Math.random().toString(36).substring(2, 9)}`,
            firstName: worker.firstName || worker.first_name || 'Worker',
            lastName: worker.lastName || worker.last_name || '',
            role: worker.role || 'Worker',
            email: worker.email || `worker${Math.floor(Math.random() * 1000)}@example.com`,
            location: worker.location || getRandomLocation(),
            joinDate: worker.joinDate || getRandomDate(new Date(2020, 0, 1), new Date()),
            status: worker.status || getRandomStatus(),
            experience: calculateExperience(worker.joinDate)
          }));
          
          // Add workers to all users array
          allUsers = [...allUsers, ...formattedWorkers];
        }
        
        // If we don't have any users, add some sample data
        if (allUsers.length === 0) {
          allUsers = generateSampleUsers(5);
          setError('No users found in the database. Using sample data.');
        } else {
          setError(null);
        }
        
        console.log('All users for report:', allUsers);
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        
        // Generate chart data from users
        updateChartData(allUsers);
        
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        setError('Failed to fetch users from database. Using sample data.');
        
        // Fallback to sample data in case of an error
        const sampleUsers = generateSampleUsers(10);
        setUsers(sampleUsers);
        setFilteredUsers(sampleUsers);
        
        // Generate chart data from sample users
        updateChartData(sampleUsers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Apply filters when filters change
  useEffect(() => {
    let filtered = [...users];
    
    // Role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
    
    // Update chart data based on filtered users
    updateChartData(filtered);
    
  }, [roleFilter, statusFilter, users]);
  
  // Update all chart data
  const updateChartData = (usersData) => {
    // Role distribution data
    const roleData = {};
    usersData.forEach(user => {
      const role = user.role || 'Unknown';
      roleData[role] = (roleData[role] || 0) + 1;
    });
    
    const roleChartData = Object.keys(roleData).map(role => ({
      name: role,
      value: roleData[role]
    }));
    
    setRoleDistribution(roleChartData);
    
    // Experience distribution data
    const experienceData = {
      'Less than 6 months': 0,
      '6-12 months': 0,
      '1-2 years': 0,
      '2-5 years': 0,
      'More than 5 years': 0
    };
    
    usersData.forEach(user => {
      const months = user.experience || 0;
      
      if (months < 6) {
        experienceData['Less than 6 months']++;
      } else if (months < 12) {
        experienceData['6-12 months']++;
      } else if (months < 24) {
        experienceData['1-2 years']++;
      } else if (months < 60) {
        experienceData['2-5 years']++;
      } else {
        experienceData['More than 5 years']++;
      }
    });
    
    const experienceChartData = Object.keys(experienceData).map(range => ({
      name: range,
      value: experienceData[range]
    }));
    
    setExperienceDistribution(experienceChartData);
    
    // Location distribution data
    const locationData = {};
    usersData.forEach(user => {
      const location = user.location || 'Unknown';
      locationData[location] = (locationData[location] || 0) + 1;
    });
    
    const locationChartData = Object.keys(locationData).map(location => ({
      name: location,
      value: locationData[location]
    }));
    
    setLocationDistribution(locationChartData);
  };
  
  // Helper function to calculate experience in months from join date
  const calculateExperience = (joinDate) => {
    if (!joinDate) return 0;
    
    const start = new Date(joinDate);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - start.getFullYear()) * 12 + 
                         (now.getMonth() - start.getMonth());
    
    return diffInMonths;
  };
  
  // Helper function to get a random location for demo data
  const getRandomLocation = () => {
    const locations = ['Main Office', 'Branch Office', 'Remote', 'Field', 'Warehouse'];
    return locations[Math.floor(Math.random() * locations.length)];
  };
  
  // Helper function to get a random date between two dates
  const getRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };
  
  // Helper function to get a random status
  const getRandomStatus = () => {
    const statuses = ['Active', 'On Leave', 'Inactive'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };
  
  // Generate sample users for fallback
  const generateSampleUsers = (count) => {
    const roles = ['Owner', 'Manager', 'Supervisor', 'Worker'];
    const users = [];
    
    for (let i = 0; i < count; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const joinDate = getRandomDate(new Date(2018, 0, 1), new Date());
      
      users.push({
        id: `user-${i}`,
        firstName: `Sample`,
        lastName: `User ${i}`,
        role,
        email: `user${i}@example.com`,
        location: getRandomLocation(),
        joinDate,
        status: getRandomStatus(),
        experience: calculateExperience(joinDate)
      });
    }
    
    return users;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setRoleFilter('All');
    setStatusFilter('All');
  };
  
  // Generate CSV data for download
  const downloadCSV = () => {
    // Create CSV headers
    const headers = ['ID', 'First Name', 'Last Name', 'Role', 'Email', 'Location', 'Join Date', 'Status', 'Experience (months)'];
    
    // Convert users to CSV format
    const csvData = filteredUsers.map(user => [
      user.id,
      user.firstName,
      user.lastName,
      user.role,
      user.email,
      user.location,
      user.joinDate,
      user.status,
      user.experience
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `user_distribution_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate unique roles from users
  const uniqueRoles = users.length > 0 
    ? ['All', ...new Set(users.map(user => user.role))]
    : ['All', 'Owner', 'Manager', 'Supervisor', 'Worker'];
  
  // Get unique statuses for filter
  const uniqueStatuses = users.length > 0
    ? ['All', ...new Set(users.map(user => user.status))]
    : ['All', 'Active', 'On Leave', 'Inactive'];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Distribution Report</h1>
        <p className="text-gray-500">Analyze user distribution across roles, experience, and locations</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4 md:mb-0">
            <Filter size={18} className="mr-2 text-green-600" />
            Filter Options
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={resetFilters}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center text-sm"
            >
              <RefreshCw size={14} className="mr-1" />
              Reset
            </button>
            <button 
              onClick={downloadCSV}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
            >
              <Download size={14} className="mr-1" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Roles</h3>
          <p className="text-2xl font-bold text-gray-800">
            {new Set(filteredUsers.map(user => user.role)).size}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Users</h3>
          <p className="text-2xl font-bold text-gray-800">
            {filteredUsers.filter(user => user.status === 'Active').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Experience</h3>
          <p className="text-2xl font-bold text-gray-800">
            {Math.round(filteredUsers.reduce((sum, user) => sum + (user.experience || 0), 0) / filteredUsers.length || 0)} months
          </p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users size={18} className="mr-2 text-green-600" />
            Role Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} users`, props.payload.name]} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award size={18} className="mr-2 text-green-600" />
            Experience Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={experienceDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Users" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin size={18} className="mr-2 text-green-600" />
          Location Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={locationDistribution}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Users" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User size={18} className="mr-2 text-green-600" />
          User List
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.slice(0, 10).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.experience} months</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length > 10 && (
            <div className="py-3 px-6 border-t border-gray-200 text-sm text-gray-500">
              Showing 10 of {filteredUsers.length} records
            </div>
          )}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No users found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDistributionReport; 