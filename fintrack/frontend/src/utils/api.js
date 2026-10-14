import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fintrack_token');
      localStorage.removeItem('fintrack_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

export const formatCurrency = (amount, currency = 'INR') => {
  const symbol =
    currency === 'INR' ? '₹' :
    currency === 'USD' ? '$' :
    currency === 'EUR' ? '€' : '₹';
  const num = Number(amount || 0);
  return `${symbol}${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export const exportToCSV = (rows, filename) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS — These are the missing exports causing the errors
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Healthcare',
  'Bills',
  'Travel',
  'Other'
];

export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Debit Card',
  'Credit Card',
  'Bank Transfer',
  'Other'
];

export const BILL_CATEGORIES = [
  'Electricity',
  'Internet',
  'Mobile',
  'Rent',
  'Subscription',
  'Education',
  'Healthcare',
  'Other'
];