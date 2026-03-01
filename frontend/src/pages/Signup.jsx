import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import React from "react"

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm">
      <div className="font-display text-2xl font-bold">Sign up</div>
      <p className="mt-1 text-sm text-slate-600">Create your account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="h-11 w-full rounded-xl border px-3 text-sm"
        />
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6)"
          className="h-11 w-full rounded-xl border px-3 text-sm"
        />
        <button
          disabled={loading}
          className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="font-semibold text-slate-900 hover:underline" to="/login">Login</Link>
      </div>
    </div>
  );
}

