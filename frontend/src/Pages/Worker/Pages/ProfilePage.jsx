import React, { useState, useEffect, useContext } from 'react';
import {
  UserIcon,
  ClipboardIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  LogOutIcon,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Login/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(!user);
  const [workLogs, setWorkLogs] = useState([]);
  const [managers, setManagers] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    manager: { id: '' },
    workerName: ''  // Add this new field
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateWorkerName = (name) => {
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)?$/;
    return regex.test(name);
  };

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/getManagers', {
          params: { role: 'Manager' },
          withCredentials: true
        });
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers', error);
        setErrorMessage('Failed to load managers');
      }
    };
    fetchManagers();
  }, []);

  // Fetch user's reports
  const fetchMyReports = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/issue-reports/my-reports', {
        withCredentials: true
      });
      
      const formattedReports = response.data.map(report => ({
        ...report,
        createdAt: report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown date',
        manager: report.manager || { firstName: 'Unknown', lastName: 'Manager' },
        status: report.status || 'PENDING'
      }));
      
      setMyReports(formattedReports);
    } catch (error) {
      console.error('Error fetching my reports', error);
      setErrorMessage('Failed to load your reports');
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  // Fetch work logs
  useEffect(() => {
    if (user) {
      const fetchWorkLogs = async () => {
        try {
          setLoading(true);
          const batchesResponse = await axios.get(
            'http://localhost:8080/api/batch-processes/getTodayBatches',
            {
              params: { userEmail: user.email },
              withCredentials: true,
            }
          );

          if (batchesResponse.data?.length > 0) {
            setWorkLogs(processBatchData(batchesResponse.data));
          } else {
            setWorkLogs([]);
          }
        } catch (error) {
          console.error('Error fetching work logs', error);
          setWorkLogs([]);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkLogs();
    }
  }, [user]);

  const processBatchData = (batches) => {
    const today = new Date().toLocaleDateString();
    return [
      {
        date: today,
        shift: user?.shift || 'Day',
        operator: `${user?.firstName} ${user?.lastName}` || 'Operator',
        batches: batches.map((batch) => ({
          id: batch.batchId,
          startTime: new Date(batch.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          endTime: batch.endTime
            ? new Date(batch.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—',
          initialMoisture: batch.initialMoisture,
          finalMoisture: batch.finalMoisture || '—',
          status: batch.endTime ? 'completed' : 'in-progress',
        })),
      },
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.manager.id) {
      setErrorMessage('Please select a manager');
      return;
    }

    if (!formData.workerName || !validateWorkerName(formData.workerName)) {
      setErrorMessage('Please enter a valid worker name (letters and one space only)');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/issue-reports/save',
        {
          issueType: formData.issueType,
          description: formData.description,
          manager: { id: formData.manager.id },
          workerName: formData.workerName
        },
        { withCredentials: true }
      );
      
      // Get manager details from the managers list
      const selectedManager = managers.find(m => m.id === formData.manager.id) || 
                            { firstName: 'Unknown', lastName: 'Manager' };
      
      const newReport = {
        ...response.data,
        createdAt: new Date().toLocaleString(),
        manager: selectedManager,
        status: 'PENDING'
      };
      
      setMyReports([newReport, ...myReports]);
      setFormData({
        issueType: '',
        description: '',
        manager: { id: '' }
      });
      setSuccessMessage('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report', error);
      setErrorMessage(error.response?.data?.message || 'Failed to submit report');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'managerId') {
      setFormData({
        ...formData,
        manager: { id: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please log in to view your profile</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Profile & Work Logs</h2>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-blue-600" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-800">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600">{user.role}</p>
            
            <div className="mt-6 w-full space-y-4">
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Shift</p>
                  <p className="text-sm font-medium text-gray-800">{user.shift || 'Day'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-sm font-medium text-gray-800">{user.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MailIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Today's Tasks</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-800">Monitor Batch #2453</p>
                </div>
                <p className="ml-5 mt-1 text-xs text-gray-600">Due by 15:00</p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-800">Clean fan filters</p>
                </div>
                <p className="ml-5 mt-1 text-xs text-gray-600">Completed at 09:30</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
                  <p className="text-sm font-medium text-gray-800">Log daily maintenance</p>
                </div>
                <p className="ml-5 mt-1 text-xs text-gray-600">Due by end of shift</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Logs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-700">Work Logs</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {workLogs.length > 0 ? (
                workLogs.map((log) => (
                  <div key={log.date} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <h4 className="text-md font-medium text-gray-800">{log.date}</h4>
                        <span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {log.shift} Shift
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">Operator: {log.operator}</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 bg-gray-100">
                        <div className="grid grid-cols-5 text-xs font-medium text-gray-500">
                          <div>Batch ID</div>
                          <div>Start Time</div>
                          <div>End Time</div>
                          <div>Initial / Final</div>
                          <div>Status</div>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {log.batches.map((batch) => (
                          <div key={batch.id} className="px-4 py-3">
                            <div className="grid grid-cols-5 text-sm">
                              <div className="font-medium text-gray-800">{batch.id}</div>
                              <div>{batch.startTime}</div>
                              <div>{batch.endTime}</div>
                              <div>
                                {batch.initialMoisture}% / {batch.finalMoisture}%
                              </div>
                              <div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    batch.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {batch.status === 'completed' ? 'COMPLETED' : 'RUNNING'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No batch processes recorded for today
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => navigate('/worker/work-logs')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Work Logs →
              </button>
            </div>
          </div>

          {/* Issue Reporting */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Report an Issue</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
  <label htmlFor="workerName" className="block text-sm font-medium text-gray-700 mb-1">
    Worker Name
  </label>
  <input
    id="workerName"
    name="workerName"
    type="text"
    value={formData.workerName}
    onChange={(e) => {
      // Basic validation while typing
      const value = e.target.value;
      if (value === '' || /^[a-zA-Z]+(?: [a-zA-Z]+)?$/.test(value)) {
        handleChange(e);
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter worker name (letters and one space only)"
    required
  />
</div>
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="MACHINE_ERROR">Machine Error</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Notify Manager
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.manager.id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.firstName} {manager.lastName} ({manager.department})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Report
                </button>
              </div>
            </form>

            {/* Recent Reports */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-700 mb-3">My Recent Reports</h4>
              
              {myReports.length > 0 ? (
                <div className="space-y-3">
                  {myReports.map(report => (
                    <div key={report.id || Math.random()} className="p-3 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {report.issueType ? report.issueType.replace('_', ' ') : 'No type'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {report.description || 'No description'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status || 'PENDING'}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>
                          To: {report.manager?.firstName || 'Unknown'} {report.manager?.lastName || 'Manager'}
                        </span>
                        <span>
                          {report.createdAt || 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reports submitted yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;