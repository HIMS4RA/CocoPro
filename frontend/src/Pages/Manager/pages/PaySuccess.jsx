import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function PaySuccess() {
  const [params] = useSearchParams();
  const payrollId = params.get("payrollId");
  const navigate = useNavigate();

  useEffect(() => {
    if (payrollId) {
      fetch(`http://localhost:8080/payroll/mark-paid/${payrollId}`, {
        method: 'PUT',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to update payment status');
          }
          // Redirect to payroll page after success
          navigate('/manager/financial');
        })
        .catch((err) => {
          console.error('Error updating payment status:', err);
        });
    }
  }, [payrollId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful</h1>
      <p className="text-gray-600 mb-4">Thank you! The payroll payment has been completed.</p>
      <Link
        to={`/payroll/${payrollId}`}  // Navigate back to the payroll page with the updated status
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Back to Payroll List
      </Link>
    </div>
  );
}
