import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';
import Card from '../../components/UI/Card';

const DailyFinishedProductForm = () => {
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    productName: '',
    description: '',
    quantityUsed: '',
    quantityProduced: '',
    unit: 'units',
    createdAt: today
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    productName: '',
    quantityUsed: '',
    quantityProduced: '',
    createdAt: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/finished-products/get');
      setFinishedProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'productName':
        if (!value.trim()) {
          error = 'Product name is required';
        } else if (value.length > 50) {
          error = 'Name must be less than 50 characters';
        }
        break;
      case 'quantityUsed':
        if (!value) {
          error = 'Quantity is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Must be a positive number';
        }
        break;
      case 'quantityProduced':
        if (!value) {
          error = 'Quantity is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Must be a positive number';
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

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = finishedProducts.filter((p) =>
      p.productName.toLowerCase().includes(value) ||
      (p.description && p.description.toLowerCase().includes(value))
    );
    setFilteredProducts(filtered);
  };

  const validateForm = () => {
    const isNameValid = validateField('productName', form.productName);
    const isUsedValid = validateField('quantityUsed', form.quantityUsed);
    const isProducedValid = validateField('quantityProduced', form.quantityProduced);
    const isDateValid = validateField('createdAt', form.createdAt);
    
    return isNameValid && isUsedValid && isProducedValid && isDateValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:8080/api/finished-products/add', {
        productName: form.productName,
        description: form.description,
        quantityUsed: parseFloat(form.quantityUsed),
        producedQuantity: parseFloat(form.quantityProduced),
        unit: form.unit,
        createdAt: form.createdAt
      });

      fetchProducts();
      setIsFormOpen(false);
      setForm({
        productName: '',
        description: '',
        quantityUsed: '',
        quantityProduced: '',
        unit: 'units',
        createdAt: today
      });
      setFieldErrors({
        productName: '',
        quantityUsed: '',
        quantityProduced: '',
        createdAt: ''
      });
    } catch (err) {
      console.error("Error adding finished product", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/finished-products/${id}`);
      setFinishedProducts(finishedProducts.filter(product => product.id !== id));
      setFilteredProducts(filteredProducts.filter(product => product.id !== id));
    } catch (err) {
      console.error("Error deleting finished product", err);
    }
  };

  return (
    <div className="relative">
      {/* Blur overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}
      
      <Card title="Daily Finished Products">
        {/* Blur content when modal is open */}
        <div className={isFormOpen ? 'blur-sm pointer-events-none' : ''}>
          {/* Top Controls */}
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <input
              type="text"
              placeholder="Search by product name or description"
              value={search}
              onChange={handleSearchChange}
              className="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Finished Product
            </button>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {['Product Name', 'Description', 'Used', 'Produced', 'Wasted', 'Unit', 'Date', 'Actions'].map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{product.productName}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{product.description || 'No description'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{product.quantityUsed}</td>
                    <td className="px-6 py-3 text-sm text-green-700 font-bold">{product.producedQuantity}</td>
                    <td className="px-6 py-3 text-sm text-red-700 font-bold">{product.quantityWasted}</td>
                    <td className="px-6 py-3 text-sm text-blue-600">{product.unit}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No finished products found.</div>
            )}
          </div>
        </div>

        {/* Add Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h3 className="text-lg font-medium mb-4">Add Finished Product</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="productName"
                      value={form.productName}
                      onChange={handleChange}
                      onBlur={(e) => validateField('productName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.productName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.productName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.productName}</p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Quantity Used */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity Used (Raw Materials) *</label>
                    <input
                      type="number"
                      name="quantityUsed"
                      value={form.quantityUsed}
                      onChange={handleChange}
                      onBlur={(e) => validateField('quantityUsed', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.quantityUsed ? 'border-red-500' : 'border-gray-300'
                      }`}
                      step="0.01"
                      min="0"
                      required
                    />
                    {fieldErrors.quantityUsed && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.quantityUsed}</p>
                    )}
                  </div>
                  
                  {/* Quantity Produced */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity Produced (End Products) *</label>
                    <input
                      type="number"
                      name="quantityProduced"
                      value={form.quantityProduced}
                      onChange={handleChange}
                      onBlur={(e) => validateField('quantityProduced', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.quantityProduced ? 'border-red-500' : 'border-gray-300'
                      }`}
                      step="0.01"
                      min="0"
                      required
                    />
                    {fieldErrors.quantityProduced && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.quantityProduced}</p>
                    )}
                  </div>
                  
                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {['units', 'kg', 'liters', 'boxes'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
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
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFieldErrors({
                        productName: '',
                        quantityUsed: '',
                        quantityProduced: '',
                        createdAt: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={
                      !!fieldErrors.productName || 
                      !!fieldErrors.quantityUsed || 
                      !!fieldErrors.quantityProduced ||
                      !!fieldErrors.createdAt ||
                      !form.productName || 
                      !form.quantityUsed || 
                      !form.quantityProduced ||
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

export default DailyFinishedProductForm;