import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Login/AuthContext';
import axios from 'axios';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ClockIcon,
} from 'lucide-react';

const IssuesPage = () => {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/issue-reports/manager', {
        withCredentials: true
      });
      
      const formattedIssues = response.data.map(issue => ({
        ...issue,
        createdAt: issue.createdAt ? new Date(issue.createdAt).toLocaleString() : 'Unknown date',
        reporter: issue.reporter || { firstName: 'Unknown', lastName: 'Reporter' }
      }));
      
      setIssues(formattedIssues);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/issue-reports/${issueId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
      
      setSuccess(`Issue marked as ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update issue status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (issueId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/issue-reports/${issueId}`,
        { withCredentials: true }
      );
      
      setIssues(issues.filter(issue => issue.id !== issueId));
      setSuccess('Issue deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting issue:', err);
      setError('Failed to delete issue');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800">Issues Management</h1>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {issue.issueType?.replace('_', ' ') || 'Unknown type'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {issue.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.reporter?.firstName} {issue.reporter?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {issue.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(issue.id, 'IN_PROGRESS')}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                              title="Accept"
                            >
                              <CheckCircleIcon className="h-5 w-5 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(issue.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Reject"
                            >
                              <XCircleIcon className="h-5 w-5 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {issue.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleStatusChange(issue.id, 'COMPLETED')}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Complete"
                          >
                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No issues assigned to you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;