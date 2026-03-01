import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import React from "react"
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm">
      <div className="font-display text-2xl font-bold">Login</div>
      <p className="mt-1 text-sm text-slate-600">Access your account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-xl border px-3 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-11 w-full rounded-xl border px-3 text-sm"
        />
        <button
          disabled={loading}
          className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        No account? <Link className="font-semibold text-slate-900 hover:underline" to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

