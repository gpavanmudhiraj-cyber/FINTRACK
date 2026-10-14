import React, { useEffect, useState } from 'react';
import API, { formatCurrency, exportToCSV } from '../utils/api';

const empty = { name: '', amount: '', date: new Date().toISOString().slice(0, 10), note: '' };

const Income = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => API.get('/income').then((res) => setItems(res.data));
  useEffect(() => {
  load();
}, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAdd = () => { setForm(empty); setEditing(null); setShowModal(true); };
  const openEdit = (i) => {
    setForm({ name: i.name, amount: i.amount, date: i.date.slice(0, 10), note: i.note || '' });
    setEditing(i.id); setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editing) await API.put(`/income/${editing}`, form);
    else await API.post('/income', form);
    setShowModal(false); load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this income record?')) return;
    await API.delete(`/income/${id}`); load();
  };

  const total = items.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Income</h1>
          <p className="text-sm text-slate-500">Total income: {formatCurrency(total)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(items.map(({ id, user_id, ...r }) => r), 'income.csv')}
            className="btn-secondary"
          >Export CSV</button>
          <button onClick={openAdd} className="btn-primary">+ Add Income</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Source</th><th>Note</th><th className="text-right">Amount</th><th></th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center text-slate-500 py-6">No income records yet</td></tr>
              )}
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{new Date(i.date).toLocaleDateString('en-IN')}</td>
                  <td>{i.name}</td>
                  <td className="text-slate-500 text-xs">{i.note}</td>
                  <td className="text-right font-medium text-emerald-600">{formatCurrency(i.amount)}</td>
                  <td className="text-right whitespace-nowrap">
                    <button className="text-primary-600 hover:underline mr-3" onClick={() => openEdit(i)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(i.id)}>Delete</button>
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
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Income' : 'Add Income'}</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="label">Source</label>
                <input name="name" required className="input" placeholder="e.g. Salary, Freelance, Allowance"
                  value={form.name} onChange={onChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Amount (₹)</label><input name="amount" type="number" step="0.01" min="0" required className="input" value={form.amount} onChange={onChange} /></div>
                <div><label className="label">Date</label><input name="date" type="date" required className="input" value={form.date} onChange={onChange} /></div>
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

export default Income;