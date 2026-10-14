import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/api';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name || '', email: user?.email || '',
    currency: user?.currency || 'INR',
    default_category: user?.default_category || 'Other',
    theme: user?.theme || 'light'
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name, email: user.email,
        currency: user.currency || 'INR',
        default_category: user.default_category || 'Other',
        theme: user.theme || 'light'
      });
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await API.put('/auth/profile', profile);
      updateUser(profile);
      setMsg('Profile saved.');
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not save');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await API.put('/auth/password', pwd);
      setPwd({ currentPassword: '', newPassword: '' });
      setMsg('Password updated.');
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not update');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {msg && <div className="text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg">{msg}</div>}
      {err && <div className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-2 rounded-lg">{err}</div>}

      {/* Profile */}
      <form onSubmit={saveProfile} className="card space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Name</label><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div>
            <label className="label">Currency</label>
            <select className="input" value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })}>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          <div>
            <label className="label">Default Expense Category</label>
            <select className="input" value={profile.default_category} onChange={(e) => setProfile({ ...profile, default_category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Appearance</label>
            <select className="input" value={profile.theme} onChange={(e) => setProfile({ ...profile, theme: e.target.value })}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <button className="btn-primary">Save Profile</button>
      </form>

      {/* Password */}
      <form onSubmit={changePassword} className="card space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Current Password</label><input type="password" required className="input" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} /></div>
          <div><label className="label">New Password</label><input type="password" minLength={6} required className="input" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} /></div>
        </div>
        <button className="btn-primary">Update Password</button>
      </form>

      {/* Account */}
      <div className="card">
        <h2 className="font-semibold mb-3">Account</h2>
        <button onClick={handleLogout} className="btn-danger">Logout</button>
      </div>
    </div>
  );
};

export default Settings;