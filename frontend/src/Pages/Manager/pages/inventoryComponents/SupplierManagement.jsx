import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Card from '../../components/UI/Card';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [currentSupplier, setCurrentSupplier] = useState({
    id: null,
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/suppliers/get');
      setSuppliers(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain letters and spaces';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 5) {
          error = 'Address must be at least 5 characters';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone is required';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone must be exactly 10 digits';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };

  const validateForm = () => {
    const isNameValid = validateField('name', currentSupplier.name);
    const isAddressValid = validateField('address', currentSupplier.address);
    const isPhoneValid = validateField('phone', currentSupplier.phone);
    
    return isNameValid && isAddressValid && isPhoneValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (currentSupplier.id) {
        await axios.put(`http://localhost:8080/api/suppliers/${currentSupplier.id}`, currentSupplier);
      } else {
        await axios.post('http://localhost:8080/api/suppliers/add', currentSupplier);
      }
      await fetchSuppliers();
      handleCloseForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsFormOpen(true);
    setFieldErrors({
      name: '',
      address: '',
      phone: ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentSupplier({ id: null, name: '', address: '', phone: '' });
    setFormError('');
    setFieldErrors({
      name: '',
      address: '',
      phone: ''
    });
  };

  if (loading) return <div className="text-center py-10 text-blue-600">Loading suppliers...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="relative">
      {/* Blur overlay that appears when modal is open */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"></div>
      )}
      
      <Card title="Supplier Management">
        {/* Apply blur effect to content when modal is open */}
        <div className={isFormOpen ? 'blur-sm pointer-events-none' : ''}>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <PlusIcon size={18} />
              Add Supplier
            </button>
          </div>

          {/* Supplier Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="px-6 py-3">{supplier.name}</td>
                    <td className="px-6 py-3 text-gray-600">{supplier.address}</td>
                    <td className="px-6 py-3 text-gray-600">{supplier.phone}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
              <h3 className="text-xl font-semibold mb-4">
                {currentSupplier.id ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && <p className="text-red-600 text-sm">{formError}</p>}

                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentSupplier.name}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-blue-500 ${
                      fieldErrors.name ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentSupplier.address}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-blue-500 ${
                      fieldErrors.address ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentSupplier.phone}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-blue-500 ${
                      fieldErrors.phone ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={Object.values(fieldErrors).some(error => error) || 
                             !currentSupplier.name || 
                             !currentSupplier.address || 
                             !currentSupplier.phone}
                  >
                    {currentSupplier.id ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SupplierManagement;
