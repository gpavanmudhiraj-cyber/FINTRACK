import React, { useEffect, useState } from 'react';
import API, { formatCurrency, exportToCSV, BILL_CATEGORIES } from '../utils/api';

const empty = {
  name: '', amount: '', category: 'Electricity',
  due_date: new Date().toISOString().slice(0, 10),
  recurring: 'one-time', note: ''
};

const statusOf = (bill) => {
  if (bill.status === 'paid') return 'paid';
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(bill.due_date);
  return due < today ? 'overdue' : 'upcoming';
};

const StatusBadge = ({ bill }) => {
  const s = statusOf(bill);
  const map = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    upcoming: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  };
  const label = { paid: 'Paid', upcoming: 'Upcoming', overdue: 'Overdue' }[s];
  return <span className={`badge ${map[s]}`}>{label}</span>;
};

const Bills = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  const load = () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    API.get('/bills', { params }).then((res) => setItems(res.data));
  };

  useEffect(() => {
  load();
}, [filters]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAdd = () => { setForm(empty); setEditing(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({
      name: b.name, amount: b.amount, category: b.category,
      due_date: b.due_date.slice(0, 10), recurring: b.recurring, note: b.note || ''
    });
    setEditing(b.id); setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editing) await API.put(`/bills/${editing}`, form);
    else await API.post('/bills', form);
    setShowModal(false); load();
  };

  const markPaid = async (id) => { await API.put(`/bills/${id}/pay`); load(); };
  const onDelete = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    await API.delete(`/bills/${id}`); load();
  };

  const totalUnpaid = items.filter((b) => b.status === 'unpaid')
    .reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Bills</h1>
          <p className="text-sm text-slate-500">Unpaid: {formatCurrency(totalUnpaid)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(items.map(({ id, user_id, ...r }) => r), 'bills.csv')}
            className="btn-secondary"
          >Export CSV</button>
          <button onClick={openAdd} className="btn-primary">+ Add Bill</button>
        </div>
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="input md:col-span-2" placeholder="Search bills…"
          value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input" value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {BILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill</th><th>Category</th><th>Due Date</th><th>Recurring</th>
                <th className="text-right">Amount</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-500 py-6">No bills found</td></tr>
              )}
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}{b.note && <p className="text-xs text-slate-500">{b.note}</p>}</td>
                  <td><span className="badge bg-slate-100 dark:bg-slate-700">{b.category}</span></td>
                  <td>{new Date(b.due_date).toLocaleDateString('en-IN')}</td>
                  <td className="capitalize">{b.recurring}</td>
                  <td className="text-right font-medium">{formatCurrency(b.amount)}</td>
                  <td><StatusBadge bill={b} /></td>
                  <td className="text-right whitespace-nowrap">
                    {b.status === 'unpaid' && (
                      <button className="text-emerald-600 hover:underline mr-3" onClick={() => markPaid(b.id)}>Mark Paid</button>
                    )}
                    <button className="text-primary-600 hover:underline mr-3" onClick={() => openEdit(b)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Bill' : 'Add Bill'}</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div><label className="label">Bill Name</label><input name="name" required className="input" value={form.name} onChange={onChange} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Amount (₹)</label><input name="amount" type="number" step="0.01" min="0" required className="input" value={form.amount} onChange={onChange} /></div>
                <div><label className="label">Due Date</label><input name="due_date" type="date" required className="input" value={form.due_date} onChange={onChange} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select name="category" className="input" value={form.category} onChange={onChange}>
                    {BILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select name="recurring" className="input" value={form.recurring} onChange={onChange}>
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
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

export default Bills;