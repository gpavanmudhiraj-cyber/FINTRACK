import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Expense Tracking', desc: 'Record daily spending in seconds with categories and payment methods.', icon: '💸' },
  { title: 'Bill Management', desc: 'Never miss a due date. Track upcoming, paid, and overdue bills.', icon: '🧾' },
  { title: 'Monthly Budget', desc: 'Set a monthly limit and get warnings as you approach it.', icon: '🎯' },
  { title: 'Expense Reports', desc: 'Visualize your spending with category and trend charts.', icon: '📈' }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">F</div>
            <span className="font-semibold text-lg">FinTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#how" className="hover:text-primary-600">How It Works</a>
            <Link to="/login" className="hover:text-primary-600">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
          <Link to="/register" className="btn-primary md:hidden">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Track Your Expenses.<br />
            Manage Your Bills.<br />
            <span className="text-primary-600">Stay in Control.</span>
          </h1>
          <p className="mt-5 text-slate-600 dark:text-slate-400 text-lg">
            FinTrack makes it simple to track your personal expenses, manage upcoming bills,
            and understand your monthly spending.
          </p>
          <div className="mt-7 flex gap-3">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="card">
          <div className="grid grid-cols-2 gap-3">
            <div className="card">
              <p className="text-xs text-slate-500">Total Balance</p>
              <p className="text-2xl font-bold mt-1 text-primary-600">₹42,300</p>
            </div>
            <div className="card">
              <p className="text-xs text-slate-500">Monthly Expenses</p>
              <p className="text-2xl font-bold mt-1">₹18,500</p>
            </div>
            <div className="card">
              <p className="text-xs text-slate-500">Upcoming Bills</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">₹6,200</p>
            </div>
            <div className="card">
              <p className="text-xs text-slate-500">Remaining Budget</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">₹6,500</p>
            </div>
          </div>
          <div className="mt-4 card">
            <div className="flex items-center justify-between text-sm">
              <span>Monthly Budget</span>
              <span className="text-slate-500">₹18,500 / ₹25,000</span>
            </div>
            <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600" style={{ width: '74%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">Everything you need to stay on top of your money</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mt-3">
            Simple, focused features that help you understand where your money goes.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {features.map((f) => (
              <div key={f.title} className="card">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-semibold mt-3">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { n: 1, t: 'Add your expenses and bills', d: 'Log every expense and bill with a few clicks.' },
              { n: 2, t: 'Set your monthly budget', d: 'Choose a monthly spending limit that works for you.' },
              { n: 3, t: 'Track your spending and upcoming payments', d: 'See your dashboard update in real-time.' }
            ].map((s) => (
              <div key={s.n} className="card text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {s.n}
                </div>
                <h3 className="font-semibold mt-3">{s.t}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold">Start managing your expenses today.</h2>
          <p className="mt-3 opacity-90">Free to use. No credit card required.</p>
          <Link
            to="/register"
            className="inline-block mt-6 bg-white text-primary-700 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>© {new Date().getFullYear()} FinTrack. All rights reserved.</div>
          <div className="flex flex-wrap gap-6">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#" className="hover:text-primary-600">About</a>
            <a href="#" className="hover:text-primary-600">Contact</a>
            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;