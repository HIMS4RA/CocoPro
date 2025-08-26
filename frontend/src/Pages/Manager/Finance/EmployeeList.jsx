import { useState, useEffect } from 'react';
import axios from 'axios';  
import { Link } from 'react-router-dom';
import { PlusIcon, CalculatorIcon, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  // Fetch employee list from the backend
  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:8080/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast.error('❌ Failed to load employees.');
    }
  };

  // Call fetchEmployees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      // Check if the employee's payment is completed
      const paymentRes = await axios.get(`http://localhost:8080/employees/${id}/payment-status`);
  
      if (paymentRes.data.status === 'unpaid') {
        toast.error('❌ Unable to delete the employee record, payment not completed yet.');
        return;
      }
  
      // Proceed to delete employee if payment is completed
      const response = await axios.delete(`http://localhost:8080/employees/${id}`);
      
      if (response.status === 200) {
        toast.success("Employee deleted successfully.");
        fetchEmployees(); // Refresh the employee list
      }
    } catch (error) {
      // Handle backend error response (409 Conflict)
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.error || "Error: Payment not completed yet.");
      } else {
        toast.error("Error occurred while deleting the employee.");
      }
    }
  };
  
  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee List</h1>
        <Link
          to="/manager/financial/employees/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate (LKR/hr)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours/Week</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap">#{emp.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.hourlyRate.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.operationalHours}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/manager/financial/employees/edit/${emp.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/payroll/${emp.id}`}
                      className="text-green-600 hover:text-green-900"
                      title="View Payroll"
                    >
                      <CalculatorIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
