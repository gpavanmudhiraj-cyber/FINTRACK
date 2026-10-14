import React, { useEffect, useState } from 'react';
import API, { formatCurrency, exportToCSV } from '../utils/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';

const COLORS = ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16','#64748b'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Reports = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [byCategory, setByCategory] = useState([]);
  const [trend, setTrend] = useState([]);
  const [ive, setIve] = useState({ income: [], expenses: [] });
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    API.get('/reports/by-category', { params: { month, year } }).then((r) => setByCategory(r.data));
    API.get('/reports/monthly-trend').then((r) => setTrend(r.data.map((d) => ({
      name: `${MONTHS[d.month - 1]} ${String(d.year).slice(2)}`,
      total: Number(d.total)
    }))));
    API.get('/reports/income-vs-expenses').then((r) => {
      const map = {};
      r.data.income.forEach((i) => {
        const k = `${i.year}-${i.month}`;
        map[k] = map[k] || { name: `${MONTHS[i.month - 1]} ${String(i.year).slice(2)}` };
        map[k].income = Number(i.total);
      });
      r.data.expenses.forEach((e) => {
        const k = `${e.year}-${e.month}`;
        map[k] = map[k] || { name: `${MONTHS[e.month - 1]} ${String(e.year).slice(2)}` };
        map[k].expenses = Number(e.total);
      });
      setIve(Object.values(map));
    });
    API.get('/reports/summary', { params: { month, year } }).then((r) => setSummary(r.data));
  }, [month, year]);

  const totalCat = byCategory.reduce((s, c) => s + Number(c.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2 items-center">
          <select className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" className="input w-28" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <button
            onClick={() => exportToCSV(
              byCategory.map((c) => ({ Category: c.category, Amount: c.total })), 'report-by-category.csv'
            )}
            className="btn-secondary"
          >Export CSV</button>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{MONTHS[month - 1]} {year} Summary</h2>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button onClick={() => setPeriod('weekly')} className={`px-3 py-1 text-sm ${period === 'weekly' ? 'bg-primary-600 text-white' : ''}`}>Weekly</button>
              <button onClick={() => setPeriod('monthly')} className={`px-3 py-1 text-sm ${period === 'monthly' ? 'bg-primary-600 text-white' : ''}`}>Monthly</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-slate-500">Income</p><p className="font-semibold text-emerald-600">{formatCurrency(summary.income)}</p></div>
            <div><p className="text-slate-500">Expenses</p><p className="font-semibold text-red-600">{formatCurrency(summary.expenses)}</p></div>
            <div><p className="text-slate-500">Bills (unpaid)</p><p className="font-semibold text-amber-600">{formatCurrency(summary.bills)}</p></div>
            <div><p className="text-slate-500">Remaining</p><p className="font-semibold text-primary-600">{formatCurrency(summary.remaining)}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-slate-500">
            <div>Highest: <span className="font-medium text-slate-700 dark:text-slate-200">{summary.highestCategory?.category || '—'}</span></div>
            <div>Expenses: <span className="font-medium text-slate-700 dark:text-slate-200">{summary.expenseCount}</span></div>
            <div>Bills: <span className="font-medium text-slate-700 dark:text-slate-200">{summary.billCount}</span></div>
            <div>Paid: <span className="font-medium text-slate-700 dark:text-slate-200">{summary.paidBills}</span></div>
            <div>Unpaid: <span className="font-medium text-slate-700 dark:text-slate-200">{summary.unpaidBills}</span></div>
          </div>
        </div>
      )}

      {/* Pie chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Expenses by Category</h2>
          {byCategory.length === 0 ? (
            <p className="text-slate-500 text-sm">No expenses this month.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byCategory} dataKey="total" nameKey="category" innerRadius={50} outerRadius={90}>
                    {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2">Total: {formatCurrency(totalCat)}</p>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Monthly Expense Trend</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <h2 className="font-semibold mb-3">Income vs Expenses</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={ive}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;