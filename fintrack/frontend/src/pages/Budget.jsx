import React, { useEffect, useState } from 'react';
import API, { formatCurrency } from '../utils/api';

const Budget = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [limit, setLimit] = useState('');
  const [spent, setSpent] = useState(0);
  const [saved, setSaved] = useState(false);

  const load = () => {
    API.get('/budget', { params: { month, year } }).then((res) => {
      setLimit(res.data.monthly_limit || '');
    });
    API.get('/reports/summary', { params: { month, year } }).then((res) => {
      setSpent(res.data.expenses);
    });
  };

  useEffect(() => {
  load();
}, [month, year]);

  const save = async (e) => {
    e.preventDefault();
    await API.post('/budget', { monthly_limit: Number(limit), month, year });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pct = limit ? Math.min(100, Math.round((spent / Number(limit)) * 100)) : 0;
  const remaining = Math.max(0, Number(limit) - spent);

  const warning =
    !limit ? null :
    pct >= 100 ? { text: 'You have reached your monthly spending limit.', cls: 'text-red-600' } :
    pct >= 80 ? { text: 'You are approaching your monthly spending limit.', cls: 'text-amber-600' } : null;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-bold">Monthly Budget</h1>

      <div className="card">
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="label">Month</label>
            <select className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {monthNames.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" className="input" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Monthly Limit (₹)</label>
            <input type="number" min="0" step="100" required className="input" value={limit} onChange={(e) => setLimit(e.target.value)} />
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <button className="btn-primary">Save Budget</button>
            {saved && <span className="text-emerald-600 text-sm">Saved!</span>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">{monthNames[month - 1]} {year}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Budget</span><span className="font-medium">{formatCurrency(limit || 0)}</span></div>
          <div className="flex justify-between"><span>Spent</span><span className="font-medium text-red-600">{formatCurrency(spent)}</span></div>
          <div className="flex justify-between"><span>Remaining</span><span className="font-medium text-emerald-600">{formatCurrency(remaining)}</span></div>
        </div>
        <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${pct >= 100 ? 'bg-red-600' : pct >= 80 ? 'bg-amber-500' : 'bg-primary-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">{pct}% of budget used</p>
        {warning && <p className={`mt-3 text-sm font-medium ${warning.cls}`}>{warning.text}</p>}
      </div>
    </div>
  );
};

export default Budget;