import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import TransactionList from './TransactionList'; 

export default function Transactions() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    type: 'INCOME',
    category: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(0); //  Trigger for refreshing transaction list

  const isValidText = (value) => /^[A-Za-z\s]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidText(form.description)) {
      toast.error('❌ Description must contain only letters and spaces');
      return;
    }
    if (!isValidText(form.category)) {
      toast.error('❌ Category must contain only letters and spaces');
      return;
    }
    if (form.amount <= 0) {
      toast.error('❌ Amount must be greater than zero');
      return;
    }

    const payload = editingId
      ? { ...form, tid: editingId }
      : { ...form };

    const apiUrl = editingId
      ? `http://localhost:8080/transactions/${editingId}`
      : 'http://localhost:8080/transactions';

    const method = editingId ? 'put' : 'post';

    try {
      await axios({
        method,
        url: apiUrl,
        data: payload,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success(editingId ? '✅ Transaction updated' : '✅ Transaction added');
      resetForm();
      setRefreshList((prev) => prev + 1); // ✅ Refresh list
    } catch (err) {
      console.error('Save Error:', err.response || err);
      toast.error('❌ Failed to save transaction');
    }
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      type: 'INCOME',
      category: '',
    });
    setEditingId(null);
  };

  const handleEdit = (txn) => {
    setForm({
      date: txn.date,
      description: txn.description,
      amount: txn.amount,
      type: txn.type,
      category: txn.category,
    });
    setEditingId(txn.tid);
  };

  const handleDelete = async (tid) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await axios.delete(`http://localhost:8080/transactions/${tid}`, { withCredentials: true });
      toast.success('🗑️ Transaction deleted');
      setRefreshList((prev) => prev + 1); // ✅ Refresh list
    } catch {
      toast.error('❌ Failed to delete transaction');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{editingId ? 'Editing Transaction' : 'Add New Transaction'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            max={!editingId ? new Date().toISOString().split('T')[0] : undefined}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Description (letters only)"
            value={form.description}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || isValidText(value)) {
                setForm({ ...form, description: value });
              }
            }}
            maxLength={50}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="LKR 0.00"
            value={form.amount === 0 ? '' : form.amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 0) {
                setForm({ ...form, amount: value });
              } else {
                setForm({ ...form, amount: 0 });
              }
            }}
            min={0}
            step="0.01"
            inputMode="decimal"
            required
            className="border p-2 rounded w-full"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
            className="border p-2 rounded w-full"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Category (letters only)"
            value={form.category}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || isValidText(value)) {
                setForm({ ...form, category: value });
              }
            }}
            maxLength={50}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>

      {/* Pass refresh trigger to TransactionList */}
      <TransactionList refreshTrigger={refreshList} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
