import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import { PlusIcon, SearchIcon, UserIcon, FilterIcon, XIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
import axios from 'axios';

const Workers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: '',
    phoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch workers from the database and filter for "Worker" role only
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/workers', {
          withCredentials: true,
        });
        const fetchedWorkers = response.data
          .filter((worker) => worker.role === 'Worker') // Filter for Worker role only
          .map((worker) => ({
            id: worker.id,
            firstName: worker.firstName || '',
            lastName: worker.lastName || '',
            name: `${worker.firstName || ''} ${worker.lastName || ''}`.trim() || 'Unknown',
            position: worker.role || 'Worker', // Will always be "Worker" due to filter
            department: worker.department || 'Not specified',
            status: worker.status || 'Active', // Assuming all are active; adjust if status field exists
            joinDate: worker.joinDate || 'Unknown', // Add joinDate to User model if needed
            efficiency: worker.efficiency || null, // Placeholder; fetch if available
            email: worker.email || '',
            phoneNumber: worker.phoneNumber || ''
          }));
        setWorkers(fetchedWorkers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workers:', err);
        setError('Failed to load workers. Please try again later.');
        setLoading(false);
        if (err.response?.status === 401) {
          window.location.href = 'http://localhost:5173'; // Redirect to login if unauthorized
        }
      }
    };

    fetchWorkers();
  }, []);

  // Handle view worker
  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
    setShowViewModal(true);
  };

  // Handle edit worker
  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setEditForm({
      firstName: worker.firstName || '',
      lastName: worker.lastName || '',
      department: worker.department || '',
      email: worker.email || '',
      phoneNumber: worker.phoneNumber || ''
    });
    setShowEditModal(true);
  };

  // Close modals
  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedWorker(null);
    setFormErrors({});
  };

  // Handle form input change with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    
    // Validate in real-time
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let errors = { ...formErrors };
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errors.firstName = 'First name should only contain letters';
        } else {
          delete errors.firstName;
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errors.lastName = 'Last name should only contain letters';
        } else {
          delete errors.lastName;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Email is invalid';
        } else {
          delete errors.email;
        }
        break;
        
      case 'phoneNumber':
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          errors.phoneNumber = 'Phone number should be 10 digits';
        } else {
          delete errors.phoneNumber;
        }
        break;
        
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate all fields before submission
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    
    // First Name
    if (!editForm.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(editForm.firstName)) {
      errors.firstName = 'First name should only contain letters';
      isValid = false;
    }
    
    // Last Name
    if (!editForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(editForm.lastName)) {
      errors.lastName = 'Last name should only contain letters';
      isValid = false;
    }
    
    // Email
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Phone Number (optional)
    if (editForm.phoneNumber && !/^\d{10}$/.test(editForm.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Phone number should be 10 digits';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(`http://localhost:8080/api/workers/${selectedWorker.id}`, {
        ...editForm,
        role: 'Worker' // Make sure to preserve the role
      }, {
        withCredentials: true
      });
      
      console.log('Worker updated:', response.data);
      
      // Update workers state
      setWorkers(workers.map(worker => 
        worker.id === selectedWorker.id ? {
          ...worker,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          name: `${editForm.firstName} ${editForm.lastName}`,
          department: editForm.department,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber
        } : worker
      ));
      
      closeModals();
      // Show success message
      alert('Worker updated successfully!');
    } catch (err) {
      console.error('Error updating worker:', err);
      alert('Failed to update worker. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search workers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <Link
            to="/manager/add-worker"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
          >
            <PlusIcon size={16} className="mr-2" />
            Add Worker
          </Link>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                        <div className="text-sm text-gray-500">Worker ID: {worker.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.efficiency ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              worker.efficiency >= 95
                                ? 'bg-green-600'
                                : worker.efficiency >= 90
                                ? 'bg-blue-600'
                                : worker.efficiency >= 80
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${worker.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{worker.efficiency}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleViewWorker(worker)}
                    >
                      View
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleEditWorker(worker)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredWorkers.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No workers found matching your search criteria.</p>
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredWorkers.length} of {workers.length} workers
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm">Previous</button>
          <button className="px-3 py-1 border rounded bg-green-600 text-white text-sm">1</button>
          <button className="px-3 py-1 border rounded text-sm">Next</button>
        </div>
      </div>

      {/* View Worker Modal */}
      {showViewModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={closeModals}
            >
              <XIcon size={20} />
            </button>
            
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon size={30} className="text-gray-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedWorker.name}</h3>
                <p className="text-sm text-gray-500">{selectedWorker.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Worker Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm">{selectedWorker.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Worker ID</p>
                    <p className="text-sm">{selectedWorker.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm">{selectedWorker.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Join Date</p>
                    <p className="text-sm">{selectedWorker.joinDate}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedWorker.email || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm">{selectedWorker.phoneNumber || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-2">Status</h4>
              <div className="flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedWorker.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedWorker.status}
                </span>
                {selectedWorker.efficiency && (
                  <div className="ml-4">
                    <p className="text-xs text-gray-500">Efficiency</p>
                    <div className="flex items-center mt-1">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            selectedWorker.efficiency >= 95
                              ? 'bg-green-600'
                              : selectedWorker.efficiency >= 90
                              ? 'bg-blue-600'
                              : selectedWorker.efficiency >= 80
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${selectedWorker.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{selectedWorker.efficiency}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-2"
                onClick={closeModals}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => {
                  closeModals();
                  handleEditWorker(selectedWorker);
                }}
              >
                Edit Worker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {showEditModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={closeModals}
            >
              <XIcon size={20} />
            </button>
            
            <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Worker</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircleIcon size={14} className="mr-1" />
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircleIcon size={14} className="mr-1" />
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircleIcon size={14} className="mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0123456789"
                  />
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircleIcon size={14} className="mr-1" />
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={editForm.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-2"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  disabled={isSubmitting || Object.keys(formErrors).length > 0}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;