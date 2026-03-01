import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api';
import React from 'react';
export default function MyAds() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/ads/mine', { silent: true });
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm('Remove this ad?')) return;
    await api.delete(`/ads/${id}`);
    toast.success('Removed');
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-2xl font-bold">My ads</div>
          <div className="mt-1 text-sm text-slate-600">Manage your posted items.</div>
        </div>
        <Link
          to="/post-ad"
          className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Post new
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">No ads yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it._id} className="flex flex-col gap-3 rounded-3xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">{it.title}</div>
                <div className="mt-1 text-sm text-slate-600">Rs {it.price} • <span className="capitalize">{it.category}</span> • {it.city}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/products/${it._id}`} className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
                  View
                </Link>
                <button onClick={() => remove(it._id)} className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

