import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start tracking your money in minutes</p>
        </div>

        {error && <div className="mb-4 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-2 rounded-lg">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input name="name" required value={form.name} onChange={onChange} className="input" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required value={form.email} onChange={onChange} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required minLength={6} value={form.password} onChange={onChange} className="input" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input name="confirmPassword" type="password" required minLength={6} value={form.confirmPassword} onChange={onChange} className="input" placeholder="Repeat password" />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;