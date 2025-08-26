import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function PayrollView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/employees/${id}`, { withCredentials: true }) // Ensure session cookies are sent
      .then((res) => setEmployee(res.data))
      .catch((err) => {
        console.error('Error fetching employee data', err);
        navigate('/manager/financial'); // Redirect back on error
      });
  }, [id, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  if (!employee) {
    return <div className="text-center mt-10 text-gray-600">Loading payroll details...</div>;
  }

  // Calculate Basic Salary
  const basicSalary = employee.hourlyRate * employee.operationalHours * 4; // Weekly salary × 4 (for monthly salary)

  // Allowance
  const allowances = 5000;

  // Overtime Calculation
  let overtimePay = 0;
  if (employee.operationalHours > 40) {
    const overtimeHours = employee.operationalHours - 40;
    overtimePay = overtimeHours * (employee.hourlyRate * 1.5);  // 1.5x hourly rate for overtime
  }

  // Gross Salary = Basic Salary + Allowances + Overtime Pay
  const grossSalary = basicSalary + allowances + overtimePay;

  // Deductions
  const epf8 = basicSalary * 0.08;  // 8% Employee's contribution
  const epf12 = basicSalary * 0.12; // 12% Employer's contribution
  const etf3 = basicSalary * 0.03;  // 3% ETF contribution
  const totalDeductions = epf8 + epf12 + etf3;

  // Net Salary = Gross Salary - Total Deductions
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="p-8">
      <Link to="/manager/financial" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payroll List
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Payroll Details - {employee.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Employee ID: #{employee.id}</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Salary Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Basic Salary Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Hourly Rate</span><span>{formatCurrency(employee.hourlyRate)}</span></div>
              <div className="flex justify-between"><span>Hours per Week</span><span>{employee.operationalHours} hours</span></div>
              <div className="flex justify-between"><span>Weekly Salary</span><span>{formatCurrency(employee.hourlyRate * employee.operationalHours)}</span></div>
              <div className="flex justify-between font-medium text-blue-600 border-t pt-2">
                <span>Monthly Basic Salary (× 4 weeks)</span><span>{formatCurrency(basicSalary)}</span>
              </div>
            </div>
          </div>

          {/* Overtime */}
          {overtimePay > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Overtime Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Overtime Hours</span>
                  <span className="text-green-600">+{formatCurrency(overtimePay)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Overtime Pay</span>
                  <span className="text-green-600">+{formatCurrency(overtimePay)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Allowance */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Allowances</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fixed Allowance</span>
                <span className="text-green-600">+{formatCurrency(allowances)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Gross Salary</span>
                <span>{formatCurrency(grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* EPF & ETF */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">EPF & ETF Contributions</h3>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Employee Contributions</h4>
                <div className="flex justify-between">
                  <span>EPF (8%)</span><span className="text-red-600">-{formatCurrency(epf8)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Deductions</span><span className="text-red-600">-{formatCurrency(totalDeductions)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <h4 className="font-medium">Employer Contributions</h4>
                <div className="flex justify-between">
                  <span>EPF (12%)</span><span className="text-blue-600">+{formatCurrency(epf12)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ETF (3%)</span><span className="text-blue-600">+{formatCurrency(etf3)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Employer Contributions</span>
                  <span className="text-blue-600">+{formatCurrency(epf12 + etf3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Net Salary</h3>
                <p className="text-sm text-gray-600">Take-home pay after deductions</p>
              </div>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(netSalary)}</span>
            </div>
            <div className="text-sm text-gray-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Gross Salary</span><span>{formatCurrency(grossSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions</span><span className="text-red-600">-{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
