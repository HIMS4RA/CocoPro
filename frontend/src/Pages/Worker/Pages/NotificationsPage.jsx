import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  FilterIcon,
  RefreshCwIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  ClockIcon,
  AlertCircleIcon,
} from 'lucide-react';
import axios from 'axios';

// Hardcoded worker ID for demo purposes
const WORKER_ID = 3;

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationList, setNotificationList] = useState([]);
  const [tasks, setTasks] = useState([]); // State for tasks fetched from the backend
  const [loadingTasks, setLoadingTasks] = useState(false); // Loading state for tasks
  const [errorTasks, setErrorTasks] = useState(null); // Error state for tasks
  const [selectedTask, setSelectedTask] = useState(null); // State for selected task details

  // Add loading and error states for notifications
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [errorNotifications, setErrorNotifications] = useState(null);

  // Fetch both notifications and tasks when the component mounts or refreshes
  useEffect(() => {
    fetchWorkerNotifications();
    fetchWorkerTasks();
  }, []);

  // New function to fetch notifications from the backend
  const fetchWorkerNotifications = async () => {
    setLoadingNotifications(true);
    setErrorNotifications(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/${WORKER_ID}`, {
        withCredentials: true,
        // If using a token, uncomment the following:
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      
      // Transform backend notification format to match frontend structure
      const transformedNotifications = response.data.map(notification => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        read: notification.read,
        time: new Date(notification.createdAt).toLocaleString(),
        taskId: notification.task?.id // Include taskId if available
      }));
      
      setNotificationList(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 403) {
        setErrorNotifications('Access denied: You do not have permission to fetch notifications.');
      } else {
        setErrorNotifications('Failed to fetch notifications. Please try again later.');
      }
      setNotificationList([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch tasks assigned to the worker from the backend
  const fetchWorkerTasks = async () => {
    setLoadingTasks(true);
    setErrorTasks(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/worker/${WORKER_ID}`, {
        withCredentials: true, // Include cookies if needed for authentication
        // If using a token, uncomment the following:
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Full error details:', error);
      if (error.response?.status === 403) {
        setErrorTasks('Access denied: You do not have permission to fetch tasks.');
      } else {
        setErrorTasks('Failed to fetch tasks. Please try again later.');
      }
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Complete a task (delete from database)
  const completeTask = async (taskId) => {
    try {
      // Include full authentication credentials
      const token = localStorage.getItem('token');
      
      // Send the request to delete the task
      const response = await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      console.log('Task completion response:', response);

      // If the response is successful
      if (response.status === 200) {
      // Remove the task from the local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
  
        // Show success message
        alert("Task completed successfully!");
        
        // Refresh both task list and notifications to reflect the changes
        fetchWorkerTasks();
        fetchWorkerNotifications();
      }
    } catch (error) {
      console.error('Full error details:', error);
  
      // Detailed error handling
      let errorMessage = 'Failed to complete task.';
      
      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage = 'You do not have permission to complete this task. Please contact your administrator.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please log in again.';
            break;
          case 404:
            errorMessage = 'Task not found. It may have already been completed.';
            // If task not found, still remove it from the UI
            setTasks(prev => prev.filter(task => task.id !== taskId));
            break;
          default:
            errorMessage = error.response.data || 'An unexpected error occurred.';
            
            // Special handling for the foreign key constraint error
            if (typeof error.response.data === 'string' && 
                error.response.data.includes('foreign key constraint fails')) {
              errorMessage = 'This task has notifications attached to it. Please try again.';
              // Refresh task and notification lists
              fetchWorkerTasks();
              fetchWorkerNotifications();
            }
        }
      }
  
      // Show an alert for immediate user feedback
      alert(errorMessage);
    }
  };

  // Filter notifications based on current filter
  const filteredNotifications =
    activeFilter === 'all'
      ? notificationList
      : activeFilter === 'unread'
        ? notificationList.filter((n) => !n.read)
        : notificationList.filter((n) => n.type === activeFilter);

  // Mark notification as read - updated to use backend
  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/notifications/${id}/read`, {}, {
        withCredentials: true,
        // Include auth token if needed
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      
      // Update local state after successful API call
    setNotificationList((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              read: true,
            }
          : n,
      ),
    );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read. Please try again.');
    }
  };

  // Mark all notifications as read - updated to use backend
  const markAllAsRead = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/notifications/user/${WORKER_ID}/read-all`, {}, {
        withCredentials: true,
        // Include auth token if needed
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      
      // Update local state after successful API call
    setNotificationList((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      })),
    );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Failed to mark all notifications as read. Please try again.');
    }
  };

  // Delete notification - updated to use backend
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`, {
        withCredentials: true,
        // Include auth token if needed
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      
      // Update local state after successful API call
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification. Please try again.');
    }
  };

  // Clear all notifications - updated to use backend
  const clearAllNotifications = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/user/${WORKER_ID}/clear-all`, {
        withCredentials: true,
        // Include auth token if needed
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      
      // Update local state after successful API call
    setNotificationList([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      alert('Failed to clear all notifications. Please try again.');
    }
  };

  // Refresh notifications and tasks from the backend
  const refreshData = () => {
    fetchWorkerNotifications();
    fetchWorkerTasks();
  };

  // View task details
  const viewTaskDetails = (task) => {
    setSelectedTask(task);
  };

  // Close task details modal
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <BellIcon className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            Notifications & Alerts
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
          >
            <CheckIcon className="h-4 w-4 mr-1.5" />
            Mark all as read
          </button>
          <button
            onClick={clearAllNotifications}
            className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
          >
            <TrashIcon className="h-4 w-4 mr-1.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FilterIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by:
            </span>
            <div className="flex items-center space-x-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'warning', label: 'Warnings' },
                { id: 'error', label: 'Errors' },
                { id: 'info', label: 'Info' },
                { id: 'success', label: 'Success' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-2.5 py-1 text-xs rounded-md ${activeFilter === filter.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className="flex items-center text-gray-500 hover:text-gray-700"
            onClick={refreshData}
          >
            <RefreshCwIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
        <div>
          {loadingNotifications ? (
            <div className="py-16 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          ) : errorNotifications ? (
            <div className="py-16 text-center">
              <div className="text-red-500 mb-2">
                <AlertCircleIcon className="h-10 w-10 mx-auto" />
              </div>
              <p className="text-red-500">{errorNotifications}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <BellIcon className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-700">
                No notifications
              </h3>
              <p className="mt-1 text-gray-500">
                {activeFilter !== 'all'
                  ? `No ${activeFilter} notifications found`
                  : "You don't have any notifications at this time"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div
                        className={`p-1 rounded-full ${notification.type === 'warning' ? 'bg-amber-100' : notification.type === 'error' ? 'bg-red-100' : notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}
                      >
                        <div
                          className={`h-3 w-3 rounded-full ${notification.type === 'warning' ? 'bg-amber-500' : notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm ${notification.read ? 'text-gray-600' : 'font-medium text-gray-900'}`}
                        >
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="Mark as read"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete notification"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      {notification.taskId && (
                        <button
                          onClick={() => {
                            const task = tasks.find(t => t.id === notification.taskId);
                            if (task) viewTaskDetails(task);
                          }}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="View related task"
                        >
                          <ClipboardIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Assigned Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <ClipboardIcon className="h-5 w-5 text-gray-600 mr-2" />
          Assigned Tasks
        </h3>
        {loadingTasks ? (
          <div className="text-center py-4 text-gray-500">
            <p>Loading tasks...</p>
          </div>
        ) : errorTasks ? (
          <div className="text-center py-4 text-red-500">
            <p>{errorTasks}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No tasks assigned to you</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-2 px-3 border border-gray-100 rounded-md hover:bg-gray-50"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Priority: {task.priority}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {task.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewTaskDetails(task)}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => completeTask(task.id)}
                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Task Details</h2>
              <button 
                onClick={closeTaskDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Title:</p>
                <p className="text-gray-800">{selectedTask.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Description:</p>
                <p className="text-gray-800">{selectedTask.description || 'No description available'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Due Date:</p>
                  <p className="text-gray-800">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority:</p>
                  <p className="text-gray-800">{selectedTask.priority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status:</p>
                  <p className="text-gray-800">{selectedTask.status}</p>
                </div>
                {selectedTask.assignedBy && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assigned By:</p>
                    <p className="text-gray-800">{selectedTask.assignedBy}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button 
                onClick={closeTaskDetails}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  completeTask(selectedTask.id);
                  closeTaskDetails();
                }}
                className="px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100"
              >
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Notification Settings
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                Push Notifications
              </h4>
              <p className="text-xs text-gray-500">
                Receive push notifications for critical alerts
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                Sound Alerts
              </h4>
              <p className="text-xs text-gray-500">
                Play sound for important alerts
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                Weather Alerts
              </h4>
              <p className="text-xs text-gray-500">
                Receive notifications about weather changes
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                System Maintenance
              </h4>
              <p className="text-xs text-gray-500">
                Alerts about system maintenance
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;