import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';
import Card from '../../components/UI/Card';

const DailyRawMaterialForm = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    unit: 'kg',
    createdAt: today,
    supplierId: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    quantity: '',
    supplierId: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, suppliersRes, reportRes] = await Promise.all([
          axios.get('http://localhost:8080/api/raw-materials'),
          axios.get('http://localhost:8080/api/suppliers/get'),
          axios.get('http://localhost:8080/api/raw-materials/daily-quantities')
        ]);
        setRawMaterials(materialsRes.data);
        setSuppliers(suppliersRes.data);
        setDailyReport(reportRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Material name is required';
        } else if (value.length > 50) {
          error = 'Name must be less than 50 characters';
        }
        break;
      case 'quantity':
        if (!value) {
          error = 'Quantity is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Must be a positive number';
        }
        break;
      case 'supplierId':
        if (!value) {
          error = 'Supplier is required';
        }
        break;
      case 'createdAt':
        if (value !== today) {
          error = 'You can only select today\'s date';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    const isNameValid = validateField('name', form.name);
    const isQuantityValid = validateField('quantity', form.quantity);
    const isSupplierValid = validateField('supplierId', form.supplierId);
    const isDateValid = validateField('createdAt', form.createdAt);
    
    return isNameValid && isQuantityValid && isSupplierValid && isDateValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:8080/api/raw-materials', {
        ...form,
        supplier: { id: form.supplierId }
      });
      const res = await axios.get('http://localhost:8080/api/raw-materials');
      const reportRes = await axios.get('http://localhost:8080/api/raw-materials/daily-quantities');
      setRawMaterials(res.data);
      setDailyReport(reportRes.data);
      setIsFormOpen(false);
      setForm({
        name: '',
        description: '',
        quantity: '',
        unit: 'kg',
        createdAt: today,
        supplierId: ''
      });
      setFieldErrors({
        name: '',
        quantity: '',
        supplierId: '',
        createdAt: ''
      });
    } catch (err) {
      console.error("Error adding material", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/raw-materials/${id}`);
      const res = await axios.get('http://localhost:8080/api/raw-materials');
      const reportRes = await axios.get('http://localhost:8080/api/raw-materials/daily-quantities');
      setRawMaterials(res.data);
      setDailyReport(reportRes.data);
    } catch (err) {
      console.error("Error deleting material", err);
    }
  };

  const filteredMaterials = rawMaterials.filter((material) => {
    const materialName = material.name?.toLowerCase() || '';
    const supplierName = material.supplier?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return materialName.includes(query) || supplierName.includes(query);
  });

  return (
    <div className="relative">
      {/* Blur overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}
      
      <Card title="Daily Raw Materials">
        {/* Blur content when modal is open */}
        <div className={isFormOpen ? 'blur-sm pointer-events-none' : ''}>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search by material or supplier..."
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              <PlusIcon size={18} />
              Add Raw Material
            </button>
          </div>

          {/* Existing Table: Raw Material List */}
          <div className="overflow-x-auto mb-10">
            <h3 className="text-lg font-semibold mb-4">All Raw Materials</h3>
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id}>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {material.name}
                      {material.description && (
                        <p className="text-xs text-gray-500">{material.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {material.quantity} {material.unit}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{material.supplier?.name || 'N/A'}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(material.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New Table: Daily Stock Report */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Daily Stock Report</h3>
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Daily Added</th>
                  <th className="px-4 py-3 text-left">Current Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyReport.map((report, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-900">{report.date}</td>
                    <td className="px-4 py-2 text-gray-600">{report.dailyAdded} kg</td>
                    <td className="px-4 py-2 text-gray-600">{report.currentStock} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Form Popup */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-6">Add Daily Raw Material</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      onBlur={(e) => validateField('quantity', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      step="0.01"
                      min="0"
                      required
                    />
                    {fieldErrors.quantity && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.quantity}</p>
                    )}
                  </div>

                  {/* Unit Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="kg">kg</option>
                      <option value="tons">tons</option>
                      <option value="liters">liters</option>
                      <option value="units">units</option>
                    </select>
                  </div>
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="createdAt"
                    value={form.createdAt}
                    onChange={handleChange}
                    onBlur={(e) => validateField('createdAt', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      fieldErrors.createdAt ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {fieldErrors.createdAt && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.createdAt}</p>
                  )}
                </div>

                {/* Supplier Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    onBlur={(e) => validateField('supplierId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      fieldErrors.supplierId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.supplierId && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.supplierId}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFieldErrors({
                        name: '',
                        quantity: '',
                        supplierId: '',
                        createdAt: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={
                      !!fieldErrors.name || 
                      !!fieldErrors.quantity || 
                      !!fieldErrors.supplierId ||
                      !!fieldErrors.createdAt ||
                      !form.name || 
                      !form.quantity || 
                      !form.supplierId ||
                      !form.createdAt
                    }
                  >
                    Save
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

export default DailyRawMaterialForm;