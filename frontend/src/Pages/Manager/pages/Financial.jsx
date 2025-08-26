import React, { useState } from 'react';
import TransactionList from '../Finance/TransactionList';  // Ensure these are correct imports
import Transactions from '../Finance/Transactions'; 
import EmployeeForm from '../Finance/EmployeeForm'; 
import EmployeeList from "../Finance/EmployeeList"; 
import { PayrollList } from '../Finance/PayrollList'; 
import ProfitLossDownload from "./ProfitLossDownload"; // Import ProfitLossDownload component

export default function Financial() {
  const [selectedSection, setSelectedSection] = useState(''); // default: nothing selected

  const renderSection = () => {
    switch (selectedSection) {
      case 'transactions':
        return (
          <div className="mt-6 space-y-6">
            <Transactions /> {/* Render Transactions */}
          </div>
        );
      case 'employees':
        return (
          <div className="mt-6 space-y-6">
            <EmployeeList /> {/* Render EmployeeList */}
          </div>
        );
      case 'payroll':
        return (
          <div className="mt-6 space-y-6">
            <PayrollList /> {/* Render PayrollList */}
          </div>
        );
      case 'profitLoss':
        return (
          <div className="mt-6 space-y-6">
            <ProfitLossDownload /> {/* Render ProfitLossDownload (Financial Statements) */}
          </div>
        );
      default:
        return <div className="mt-6 text-gray-500">Select a section to view details</div>; // Default text if no section is selected
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Employees Section Button */}
        <div
          onClick={() => setSelectedSection('employees')}
          className="cursor-pointer bg-white shadow-md p-6 rounded-lg text-center hover:bg-blue-50 transition"
        >
          <h2 className="text-xl font-semibold">Employees</h2>
          <p className="text-gray-500 mt-2">Manage employee records and salaries</p>
        </div>

        {/* Transactions Section Button */}
        <div
          onClick={() => setSelectedSection('transactions')}
          className="cursor-pointer bg-white shadow-md p-6 rounded-lg text-center hover:bg-green-50 transition"
        >
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-gray-500 mt-2">View and manage financial transactions</p>
        </div>

        {/* Payroll Section Button */}
        <div
          onClick={() => setSelectedSection('payroll')}
          className="cursor-pointer bg-white shadow-md p-6 rounded-lg text-center hover:bg-yellow-50 transition"
        >
          <h2 className="text-xl font-semibold">Payroll</h2>
          <p className="text-gray-500 mt-2">View payroll and payment status</p>
        </div>

        {/* Financial Statements Section Button */}
        <div
          onClick={() => setSelectedSection('profitLoss')}
          className="cursor-pointer bg-white shadow-md p-6 rounded-lg text-center hover:bg-purple-50 transition"
        >
          <h2 className="text-xl font-semibold">Financial Statements</h2>
          <p className="text-gray-500 mt-2">Download Statements</p>
        </div>
      </div>

      {/* Render the selected section */}
      {renderSection()}
    </div>
  );
}
