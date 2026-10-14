import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { formatCurrency } from '../utils/api';

const StatusBadge = ({ status, dueDate }) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(dueDate);
  const overdue = status === 'unpaid' && due < today;

  if (status === 'paid') return <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Paid</span>;
  if (overdue) return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Overdue</span>;
  return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Upcoming</span>;
};

const daysUntil = (dateStr) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr);
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/reports/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
  load();
}, []);

  if (loading) return <p className="text-slate-500">Loading dashboard…</p>;
  if (!data) return <p className="text-slate-500">No data.</p>;

  const budgetPct = data.monthlyBudget
    ? Math.min(100, Math.round((data.monthlyExpenses / data.monthlyBudget) * 100))
    : 0;

  const budgetWarning =
    data.monthlyBudget === 0 ? null :
    budgetPct >= 100 ? { text: 'You have reached your monthly spending limit.', color: 'text-red-600' } :
    budgetPct >= 80 ? { text: 'You are approaching your monthly spending limit.', color: 'text-amber-600' } : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-slate-500">Total Balance</p>
          <p className="text-2xl font-bold mt-1 text-primary-600">{formatCurrency(data.totalBalance)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Monthly Income</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{formatCurrency(data.monthlyIncome)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Monthly Expenses</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(data.monthlyExpenses)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Upcoming Bills</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{formatCurrency(data.upcomingBills)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent Expenses</h2>
            <Link to="/expenses" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Expense</th><th>Category</th><th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentExpenses.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-slate-500 py-6">No expenses yet</td></tr>
                )}
                {data.recentExpenses.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                    <td>{e.name}</td>
                    <td><span className="badge bg-slate-100 dark:bg-slate-700">{e.category}</span></td>
                    <td className="text-right font-medium">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <h2 className="font-semibold mb-3">Monthly Budget</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Budget</span><span className="font-medium">{formatCurrency(data.monthlyBudget)}</span></div>
            <div className="flex justify-between"><span>Spent</span><span className="font-medium text-red-600">{formatCurrency(data.monthlyExpenses)}</span></div>
            <div className="flex justify-between"><span>Remaining</span><span className="font-medium text-emerald-600">{formatCurrency(data.remainingBudget)}</span></div>
          </div>
          <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetPct >= 100 ? 'bg-red-600' : budgetPct >= 80 ? 'bg-amber-500' : 'bg-primary-600'}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{budgetPct}% used</p>
          {budgetWarning && (
            <p className={`mt-3 text-sm font-medium ${budgetWarning.color}`}>{budgetWarning.text}</p>
          )}
          <Link to="/budget" className="btn-secondary w-full mt-4 block text-center">Manage Budget</Link>
        </div>
      </div>

      {/* Upcoming Bills */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Upcoming Bills</h2>
          <Link to="/bills" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Reminder</th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingBillsList.length === 0 && (
                <tr><td colSpan={5} className="text-center text-slate-500 py-6">No upcoming bills</td></tr>
              )}
              {data.upcomingBillsList.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{new Date(b.due_date).toLocaleDateString('en-IN')}</td>
                  <td>{formatCurrency(b.amount)}</td>
                  <td><StatusBadge status={b.status} dueDate={b.due_date} /></td>
                  <td className="text-sm text-slate-500">{daysUntil(b.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;