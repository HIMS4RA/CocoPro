import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  AlertOctagonIcon,
  InfoIcon,
  CheckCircleIcon,
  FilterIcon,
} from 'lucide-react';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      title: 'Temperature Spike',
      description: 'Temperature exceeded 75°C in Drying Station 3',
      station: 'Drying Station 3',
      severity: 'critical',
      timestamp: '2023-08-10 14:32',
      status: 'active',
    },
    {
      id: 2,
      title: 'High Humidity Warning',
      description: 'Humidity levels above optimal range (45%)',
      station: 'Drying Station 3',
      severity: 'warning',
      timestamp: '2023-08-10 13:15',
      status: 'acknowledged',
    },
    {
      id: 3,
      title: 'Fan Speed Fluctuation',
      description: 'Fan speed unstable in Drying Station 2',
      station: 'Drying Station 2',
      severity: 'warning',
      timestamp: '2023-08-10 11:47',
      status: 'active',
    },
    {
      id: 4,
      title: 'Routine Maintenance Due',
      description: 'Scheduled maintenance for Drying Station 4',
      station: 'Drying Station 4',
      severity: 'info',
      timestamp: '2023-08-10 09:30',
      status: 'resolved',
    },
    {
      id: 5,
      title: 'Power Fluctuation',
      description: 'Brief power dip detected in the system',
      station: 'All Stations',
      severity: 'warning',
      timestamp: '2023-08-09 17:22',
      status: 'resolved',
    },
  ]);
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const severityIcons = {
    critical: <AlertOctagonIcon className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />,
    info: <InfoIcon className="h-5 w-5 text-blue-500" />,
  };

  const statusBadges = {
    active: (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        Active
      </span>
    ),
    acknowledged: (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
        Acknowledged
      </span>
    ),
    resolved: (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        Resolved
      </span>
    ),
  };

  const getSeverityIcon = (severity) => severityIcons[severity] || null;
  const getStatusBadge = (status) => statusBadges[status] || null;

  const filteredIncidents =
    filter === 'all'
      ? incidents
      : incidents.filter((incident) => incident.status === filter);

  const handleUpdateStatus = (id, newStatus) => {
    const updatedIncidents = incidents.map((incident) => {
      if (incident.id === id) {
        return {
          ...incident,
          status: newStatus,
        };
      }
      return incident;
    });
    setIncidents(updatedIncidents);
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        status: newStatus,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Incident Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">Incidents</h3>
              <div className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-1 text-gray-500" />
                <select
                  className="text-sm border-none bg-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedIncident?.id === incident.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex items-start">
                    {getSeverityIcon(incident.severity)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{incident.title}</h4>
                        {getStatusBadge(incident.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {incident.station}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {incident.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No incidents found
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getSeverityIcon(selectedIncident.severity)}
                    <h3 className="font-medium text-lg ml-2">
                      {selectedIncident.title}
                    </h3>
                  </div>
                  {getStatusBadge(selectedIncident.status)}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Station</p>
                    <p className="font-medium">{selectedIncident.station}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timestamp</p>
                    <p className="font-medium">{selectedIncident.timestamp}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p>{selectedIncident.description}</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">System Data</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {`Temperature: 71.2°C
Humidity: 45.8%
Fan Speed: 1320 RPM
Power: 4.2 kW
Last Maintenance: 2023-07-28`}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.status === 'active' && (
                    <button
                      className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200"
                      onClick={() =>
                        handleUpdateStatus(selectedIncident.id, 'acknowledged')
                      }
                    >
                      Acknowledge
                    </button>
                  )}
                  {(selectedIncident.status === 'active' ||
                    selectedIncident.status === 'acknowledged') && (
                    <button
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
                      onClick={() =>
                        handleUpdateStatus(selectedIncident.id, 'resolved')
                      }
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200">
                    Generate Report
                  </button>
                  {selectedIncident.severity === 'critical' && (
                    <button className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200">
                      Emergency Shutdown
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">
                Select an incident to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentManagement;
