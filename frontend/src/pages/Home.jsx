import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AdCard from '../components/AdCard.jsx';
import React from 'react';
import { useCart } from '../context/CartContext.jsx';

const CATEGORIES = [
  { id: 'cars', label: 'Cars' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'books', label: 'Books' },
  { id: 'other', label: 'Other' },
];

export default function Home() {
  const { isGridView } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (category) p.set('category', category);
    if (city) p.set('city', city);
    return p.toString();
  }, [q, category, city]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get('/ads?limit=8', { silent: true })
      .then(({ data }) => {
        if (!alive) return;
        setItems(data.items || []);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  function submit(e) {
    e.preventDefault();
    navigate(`/products?${query}`);
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-slate-50 p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
             Buy instantly. Sell effortlessly. Your marketplace, simplified.
            </h1>
            <p className="mt-3 text-slate-600 text-sm ">
             Your items, someone’s treasure—buy and sell with a single click.
            </p>

            <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search (e.g. iPhone, Corolla)"
                className="h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Lahore)"
                className="h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                className="sm:col-span-3 h-11 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/products?category=${c.id}`)}
                className="rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="text-sm font-semibold">{c.label}</div>
                <div className="mt-1 text-xs text-slate-600">Explore</div>
              </button>
            ))}
          </div>
        </div>
      </section>

<section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Latest ads</h2>
        <button 
          onClick={() => navigate('/products')} 
          className="text-sm font-semibold text-slate-700 hover:text-black transition-colors"
        >
          View all
        </button>
      </div>
      
      {loading ? (
        // Loading state ko bhi grid ke mutabiq adjust karein
        <div className={`grid gap-4 ${isGridView ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-3xl bg-slate-100 animate-pulse ${isGridView ? 'h-60' : 'h-32'}`} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
          No ads available right now.
        </div>
      ) : (
        // Yahan Dynamic Grid Classes apply ho rahi hain
        <div className={`grid gap-4 ${
          isGridView 
            ? 'grid-cols-2 md:grid-cols-3 ' // Multi-column (2 on mobile, 4 on desktop)
            : 'grid-cols-1'                               // Single-column (List view)
        }`}>
          {items.map((it) => (
            <AdCard key={it._id} item={it} />
          ))}
        </div>
      )}
    </section>
    </div>
  );
}

