import React, { useEffect, useState } from 'react';
import API, { formatCurrency, exportToCSV, CATEGORIES, PAYMENT_METHODS } from '../utils/api';

const empty = {
  name: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10),
  payment_method: 'UPI', note: ''
};

const Expenses = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '', category: '', payment_method: '', from: '', to: ''
  });

  const load = () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    API.get('/expenses', { params }).then((res) => setItems(res.data));
  };

  useEffect(load, [filters]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setForm(empty); setEditing(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      name: item.name, amount: item.amount, category: item.category,
      date: item.date.slice(0, 10), payment_method: item.payment_method, note: item.note || ''
    });
    setEditing(item.id);
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editing) await API.put(`/expenses/${editing}`, form);
    else await API.post('/expenses', form);
    setShowModal(false);
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await API.delete(`/expenses/${id}`);
    load();
  };

  const total = items.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-slate-500">Total shown: {formatCurrency(total)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(items.map(({ id, user_id, ...r }) => r), 'expenses.csv')}
            className="btn-secondary"
          >Export CSV</button>
          <button onClick={openAdd} className="btn-primary">+ Add Expense</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-5 gap-3">
        <input className="input md:col-span-2" placeholder="Search…" value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input" value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.payment_method}
          onChange={(e) => setFilters({ ...filters, payment_method: e.target.value })}>
          <option value="">All Payment Methods</option>
          {PAYMENT_METHODS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="date" className="input" value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <input type="date" className="input" value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Category</th><th>Payment</th>
                <th className="text-right">Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-slate-500 py-6">No expenses found</td></tr>
              )}
              {items.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                  <td>{e.name}{e.note && <p className="text-xs text-slate-500">{e.note}</p>}</td>
                  <td><span className="badge bg-slate-100 dark:bg-slate-700">{e.category}</span></td>
                  <td>{e.payment_method}</td>
                  <td className="text-right font-medium">{formatCurrency(e.amount)}</td>
                  <td className="text-right whitespace-nowrap">
                    <button className="text-primary-600 hover:underline mr-3" onClick={() => openEdit(e)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div><label className="label">Name</label><input name="name" required className="input" value={form.name} onChange={onChange} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Amount (₹)</label><input name="amount" type="number" step="0.01" min="0" required className="input" value={form.amount} onChange={onChange} /></div>
                <div><label className="label">Date</label><input name="date" type="date" required className="input" value={form.date} onChange={onChange} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select name="category" className="input" value={form.category} onChange={onChange}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Payment Method</label>
                  <select name="payment_method" className="input" value={form.payment_method} onChange={onChange}>
                    {PAYMENT_METHODS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Note (optional)</label><textarea name="note" className="input" rows={2} value={form.note} onChange={onChange} /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;