import { useSearchParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PayCancel() {
  const [params] = useSearchParams();
  const payrollId = params.get("payrollId"); // Grab any relevant query param

  // Optional: Perform any action based on payrollId (e.g., log it or call an API)

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-4">The payment process was cancelled or failed.</p>
      <Link
        to='/manager/financial'  // Adjust URL if you need to redirect somewhere else
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Back to Payroll List
      </Link>
    </div>
  );
}
