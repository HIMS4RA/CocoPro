import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionList({ refreshTrigger, onEdit, onDelete }) {
  const [transactions, setTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger, categoryFilter, dateFilter]);

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (categoryFilter) params.type = categoryFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await axios.get('http://localhost:8080/transactions', {
        params,
        withCredentials: true
      });
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  const resetFilters = () => {
    setCategoryFilter('');
    setDateFilter('');
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded p-2"
        />

        <button
          type="button"
          onClick={resetFilters}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Amount (LKR)</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.tid} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">#{tx.tid}</td>
                <td className="px-6 py-4">{tx.date}</td>
                <td className="px-6 py-4">{tx.type}</td>
                <td className="px-6 py-4">{tx.category}</td>
                <td className="px-6 py-4">{tx.description}</td>
                <td className="px-6 py-4 text-right">LKR {tx.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(tx)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => onDelete(tx.tid)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
