import React, { useState, useMemo } from 'react';
import {
  UserIcon,
  ClipboardListIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

const ProfileLogs = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');

  const activityLogs = [
    {
      id: 1,
      action: 'Approved emergency shutdown',
      details: 'Approved emergency shutdown request for Drying Station 3',
      timestamp: '2023-08-10 15:45',
      type: 'incident',
    },
    {
      id: 2,
      action: 'Assigned task to John Smith',
      details: 'Task: Monitor moisture levels in Drying Station 1',
      timestamp: '2023-08-10 14:30',
      type: 'worker',
    },
    {
      id: 3,
      action: 'Generated maintenance request',
      details: 'Scheduled maintenance for fan motor in Drying Station 2',
      timestamp: '2023-08-10 13:15',
      type: 'maintenance',
    },
    {
      id: 4,
      action: 'Adjusted temperature threshold',
      details: 'Changed temperature alert threshold from 70°C to 72°C',
      timestamp: '2023-08-10 11:20',
      type: 'system',
    },
    {
      id: 5,
      action: 'Acknowledged alert',
      details: 'Acknowledged high humidity warning in Drying Station 3',
      timestamp: '2023-08-10 10:45',
      type: 'incident',
    },
    {
      id: 6,
      action: 'Logged in',
      details: 'User logged into the system',
      timestamp: '2023-08-10 08:30',
      type: 'system',
    },
    {
      id: 7,
      action: 'Generated daily report',
      details: 'Created production summary report for 2023-08-09',
      timestamp: '2023-08-09 17:45',
      type: 'system',
    },
  ];

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'system':
        return 'bg-blue-100 text-blue-800';
      case 'worker':
        return 'bg-green-100 text-green-800';
      case 'incident':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = useMemo(() => {
    return activityLogs
      .filter((log) => {
        // Apply type filter
        if (logFilter !== 'all' && log.type !== logFilter) return false;
        // Apply search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            log.action.toLowerCase().includes(query) ||
            log.details.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by timestamp
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [activityLogs, searchQuery, logFilter, sortDirection]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile & Activity Logs</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'activity' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity Logs
            </button>
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'profile' ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-green-600" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium">Supervisor</h3>
                  <p className="text-gray-500">System Administrator</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium">Alex Rodriguez</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee ID</p>
                      <p className="font-medium">SUP-2023-001</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="font-medium">Production</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="font-medium">Senior Supervisor</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">alex.rodriguez@cocopro.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Emergency Contact</p>
                      <p className="font-medium">+1 (555) 987-6543</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">System Access</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Access Level</p>
                      <p className="font-medium">Administrator</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Login</p>
                      <p className="font-medium">2023-08-10 08:30</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Password Updated</p>
                      <p className="font-medium">2023-07-15</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Update Profile
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <FilterIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <select
                      className="border border-gray-300 rounded-lg p-2 text-sm"
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="system">System</option>
                      <option value="worker">Worker</option>
                      <option value="incident">Incident</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <button
                    className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    <span className="mr-1">Date</span>
                    {sortDirection === 'asc' ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {filteredLogs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-gray-100">
                        <div className="flex items-start">
                          <ClipboardListIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h4 className="font-medium">{log.action}</h4>
                                <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getLogTypeColor(log.type)}`}
                                >
                                  {log.type}
                                </span>
                                <span className="text-xs text-gray-400 ml-3">{log.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">No activity logs found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLogs;
