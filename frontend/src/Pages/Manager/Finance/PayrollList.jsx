import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CalculatorIcon, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    axios.get('http://localhost:8080/payroll')
      .then(res => {
        setPayrolls(res.data);
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch(err => {
        console.error('Error fetching payrolls:', err);
        setLoading(false);  // Stop loading even if there is an error
      });
  }, []);

  const handlePayment = async (payrollId) => {
    try {
      const res = await axios.post(`http://localhost:8080/stripe/pay/${payrollId}`);
      const sessionUrl = res.data.sessionUrl;
      if (sessionUrl) {
        window.location.href = sessionUrl;  // Redirect to Stripe checkout
      }
    } catch (err) {
      toast.error(`❌ Payment initiation failed: ${err.response?.data?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading payrolls...</div>; // Loading state
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payroll Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Net Salary</th> 
              <th className="px-6 py-3">Payment Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id}> {/* Ensure unique key */}
                <td className="px-6 py-3">#{p.employee.id}</td>
                <td className="px-6 py-3">{p.employee.name}</td>
                <td className="px-6 py-3">{p.employee.role}</td>
                <td className="px-6 py-3">LKR {p.netSalary.toLocaleString()}</td> {/* Change here */}
                <td className="px-6 py-3">{p.paymentStatus}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <Link
                    to={`/payroll/${p.employee.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <CalculatorIcon className="w-4 h-4 inline" /> Contributions
                  </Link>
                  {p.paymentStatus === "NOT_PAID" && (
                    <button
                      onClick={() => handlePayment(p.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
                    >
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
