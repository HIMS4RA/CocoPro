import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'WORKER', label: 'Worker' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'OWNER', label: 'Owner' }
];

export default function EmployeeForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState(100);
  const [operationalHours, setOperationalHours] = useState(40);
  const [role, setRole] = useState('WORKER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validation states
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    hourlyRate: '',
    operationalHours: '',
    role: ''
  });

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetch(`http://localhost:8080/employees/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch employee');
          return res.json();
        })
        .then((data) => {
          setEmail(data.email);
          setName(data.name);
          setHourlyRate(data.hourlyRate);
          setOperationalHours(data.operationalHours);
          setRole(data.role);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching employee:', err);
          setError('Employee not found or failed to load. Please check the ID.');
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        validateEmail(value);
        break;
      case 'name':
        setName(value);
        validateName(value);
        break;
      case 'hourlyRate':
        setHourlyRate(value);
        validateHourlyRate(value);
        break;
      case 'operationalHours':
        setOperationalHours(value);
        validateOperationalHours(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    // Allow only letters (A-Z, a-z) and spaces
    if (/[^a-zA-Z\s]/.test(inputValue)) {
      e.preventDefault(); // Prevent input if it's not a letter or space
    } else {
      setName(inputValue); // Update name if it's valid
      validateName(inputValue); // Validate the name
    }
  };

  const validateEmail = (value) => {
    let error = '';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!value) {
      error = 'Email is required';
    } else if (!emailRegex.test(value)) {
      error = 'Please enter a valid email address';
    }
    setFormErrors({ ...formErrors, email: error });
  };

  const validateName = (value) => {
    let error = '';
    if (!value) {
      error = 'Name is required';
    } else if (value.length < 2 || value.length > 50) {
      error = 'Name must be between 2 and 50 characters';
    }
    setFormErrors({ ...formErrors, name: error });
  };

  const validateHourlyRate = (value) => {
    let error = '';
    if (!value || value < 100) {
      error = 'Hourly rate must be at least 100';
    }
    setFormErrors({ ...formErrors, hourlyRate: error });
  };

  const validateOperationalHours = (value) => {
    let error = '';
    if (!value || value < 1 || value > 168) {
      error = 'Operational hours must be between 1 and 168';
    }
    setFormErrors({ ...formErrors, operationalHours: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const employeeData = { email, name, hourlyRate, operationalHours, role };

    try {
      const response = await fetch(
        isEditing ? `http://localhost:8080/employees/${id}` : 'http://localhost:8080/employees',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(employeeData),
        }
      );

      if (response.ok) {
        toast.success(isEditing ? '✅ Employee updated!' : '✅ Employee added!');
        navigate('/manager/financial');
      } else {
        toast.error('❌ Failed to save employee.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('❌ Server error.');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing && loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        {isEditing ? 'Edit Employee' : 'Add New Employee'}
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isEditing && (
            <div>
              <label className="block text-lg font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                value={id}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 bg-gray-100"
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700">Email *</label>
            <input
              type="email"
              required
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Hourly Rate (LKR) *</label>
            <input
              type="number"
              min={100}
              name="hourlyRate"
              value={hourlyRate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.hourlyRate && <p className="text-red-500 text-sm">{formErrors.hourlyRate}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              required
              name="name"
              value={name}
              onChange={handleNameChange} // Updated to restrict non-letter input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Operational Hours *</label>
            <input
              type="number"
              min={1}
              max={168}
              name="operationalHours"
              value={operationalHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.operationalHours && <p className="text-red-500 text-sm">{formErrors.operationalHours}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Role *</label>
            <select
              required
              name="role"
              value={role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || Object.values(formErrors).some((error) => error)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
