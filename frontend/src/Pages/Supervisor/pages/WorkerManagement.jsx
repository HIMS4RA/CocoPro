import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  PlusIcon,
  Calendar,
  ClipboardList,
  Bell,
} from 'lucide-react';
import axios from 'axios';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loggedInUsers, setLoggedInUsers] = useState(new Set());
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerDetails, setWorkerDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
  });
  
  // Error state for validation
  const [errors, setErrors] = useState({});

  // Fetch initial data
  useEffect(() => {
    fetchWorkers();
    fetchLoggedInUsers();
  }, []);

  // Fetch worker details when a worker is selected
  useEffect(() => {
    if (selectedWorker) {
      fetchWorkerDetails(selectedWorker.id);
      fetchWorkerTasks(selectedWorker.id);
    }
  }, [selectedWorker]);

  // Fetch all workers from the backend
  const fetchWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/workers');
      console.log('Workers response:', response.data); // Debugging
      if (Array.isArray(response.data)) {
        const transformedWorkers = response.data.map(worker => ({
          id: worker.id,
          name: `${worker.firstName} ${worker.lastName}`,
          role: worker.role,
          email: worker.email,
          status: 'active', // Default status
        }));
        setWorkers(transformedWorkers);
      } else {
        console.error('Invalid workers data:', response.data);
        setWorkers([]);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      setWorkers([]);
    }
  };

  // Fetch logged-in user status
  const fetchLoggedInUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/api/workers/status');
      setLoggedInUsers(new Set(response.data));
    } catch (error) {
      console.error('Error fetching logged-in users:', error);
    }
  };

  // Fetch details for a specific worker
  const fetchWorkerDetails = async (workerId) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      if (worker) {
        const response = await axios.get(`http://localhost:8080/api/workers/${workerId}`);
        setWorkerDetails(response.data || worker);
      }
    } catch (error) {
      console.error('Error fetching worker details:', error);
      const worker = workers.find(w => w.id === workerId);
      setWorkerDetails(worker);
    }
  };

  // Fetch tasks assigned to a specific worker
  const fetchWorkerTasks = async (workerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/worker/${workerId}`);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('Invalid tasks data:', response.data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching worker tasks:', error);
      setTasks([]);
    }
  };

  // Handle form input changes for new task
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate the task form
  const validateTaskForm = () => {
    const newErrors = {};

    // Title: Required
    if (!newTask.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    // Description: Required
    if (!newTask.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Deadline: Required and must not be in the past
    if (!newTask.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD
      if (newTask.deadline < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    // Priority: Optional (has default), no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Updated handleAssignTask with validation
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!selectedWorker) {
      alert('Please select a worker first');
      return;
    }

    if (!validateTaskForm()) {
      console.log('Validation errors:', errors);
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline,
        priority: newTask.priority,
        status: 'pending',
        workerId: selectedWorker.id,
      };

      const response = await axios.post('http://localhost:8080/api/tasks/assign', taskData);

      if (response.data) {
        fetchWorkerTasks(selectedWorker.id);
        setNewTask({
          title: '',
          description: '',
          deadline: '',
          priority: 'medium',
        });
        setErrors({}); // Clear errors on success
        alert('Task assigned successfully');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        alert(`Failed to assign task: ${error.response.data || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        alert('Failed to assign task. Please try again.');
      }
    }
  };

  // Utility functions for status display
  const getStatusColor = (worker) => {
    return loggedInUsers.has(worker.id) ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (worker) => {
    return loggedInUsers.has(worker.id) ? 'Active' : 'Not Active';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      case 'low':
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Worker Management</h2>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers list panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-lg">Workers</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {Array.isArray(workers) && workers.length > 0 ? (
                workers.map((worker) => (
                  <div
                    key={worker.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedWorker?.id === worker.id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setSelectedWorker(worker)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="font-medium text-green-800">
                            {worker.name ? worker.name.split(' ').map((n) => n[0]).join('') : 'NA'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{worker.name}</h4>
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(worker)}`}
                          ></span>
                        </div>
                        <p className="text-sm text-gray-500">{worker.role}</p>
                        <p className="text-sm text-gray-500">{getStatusText(worker)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No workers found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Worker details and task assignment panel */}
        <div className="lg:col-span-2">
          {selectedWorker ? (
            <div className="grid grid-cols-1 gap-6">
              {/* Worker details card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-lg">Worker Details</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedWorker.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{selectedWorker.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedWorker.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{getStatusText(selectedWorker)}</p>
                    </div>
                    {workerDetails && workerDetails.phoneNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{workerDetails.phoneNumber}</p>
                      </div>
                    )}
                    {workerDetails && workerDetails.joinDate && (
                      <div>
                        <p className="text-sm text-gray-500">Join Date</p>
                        <p className="font-medium">{workerDetails.joinDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task assignment form */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    <h3 className="font-medium text-lg">Assign New Task</h3>
                  </div>
                </div>
                <div className="p-4">
                  <form onSubmit={handleAssignTask}>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Task Title</label>
                        <input
                          type="text"
                          name="title"
                          value={newTask.title}
                          onChange={handleTaskInputChange}
                          className={`mt-1 block w-full border ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          value={newTask.description}
                          onChange={handleTaskInputChange}
                          className={`mt-1 block w-full border ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          rows="3"
                        ></textarea>
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Deadline</label>
                          <input
                            type="date"
                            name="deadline"
                            value={newTask.deadline}
                            onChange={handleTaskInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`mt-1 block w-full border ${
                              errors.deadline ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          />
                          {errors.deadline && (
                            <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Priority</label>
                          <select
                            name="priority"
                            value={newTask.priority}
                            onChange={handleTaskInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                        >
                          <PlusIcon className="h-5 w-5 mr-1" />
                          Assign Task
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Worker's current tasks */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <h3 className="font-medium text-lg">Current Tasks</h3>
                  </div>
                </div>
                <div className="p-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No tasks assigned yet
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(task.status)}
                              <div className="ml-2">
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-600">{task.description}</p>
                              </div>
                            </div>
                            <span
                              className={`border px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                            {task.sentBy && (
                              <p>From: {task.sentBy}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">
                Select a worker to view details and assign tasks
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerManagement;