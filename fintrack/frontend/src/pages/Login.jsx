import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!form.email) { setError('Enter your email first'); return; }
    try {
      const res = await API.post('/auth/forgot-password', { email: form.email });
      setInfo(res.data.message);
    } catch {
      setError('Could not send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md card">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">F</div>
            <span className="font-semibold text-lg">FinTrack</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Log in to your FinTrack account</p>
        </div>

        {error && <div className="mb-4 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-2 rounded-lg">{error}</div>}
        {info && <div className="mb-4 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg">{info}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required value={form.email} onChange={onChange} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required value={form.password} onChange={onChange} className="input" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button onClick={forgotPassword} className="text-primary-600 hover:underline">Forgot Password?</button>
          <Link to="/register" className="text-primary-600 hover:underline">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;