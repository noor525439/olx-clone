import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import AdCard from '../components/AdCard.jsx';
import React from 'react';
import { useCart } from '../context/CartContext.jsx';

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'cars', label: 'Cars' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'books', label: 'Books' },
  { id: 'other', label: 'Other' },
];

export default function Products() {
  const { isGridView } = useCart();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle state

  const currentQuery = params.toString();

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const fetchParams = new URLSearchParams(params);
    if (!fetchParams.has('page')) fetchParams.set('page', '1');
    if (!fetchParams.has('limit')) fetchParams.set('limit', '12');

    api.get(`/ads?${fetchParams.toString()}`, { silent: true })
      .then(({ data }) => {
        if (!alive) return;
        setItems(data.items || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 12 });
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [currentQuery]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setParams(next);
  }

  function goPage(p) {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex gap-2">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {isFilterOpen ? 'Close Filters' : 'Show Filters & Search'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        
        {/* Filters Sidebar - Responsive Logic */}
        <aside className={`
          ${isFilterOpen ? 'block' : 'hidden'} 
          lg:block h-fit lg:sticky lg:top-24 space-y-6 mb-8 lg:mb-0
        `}>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="hidden lg:flex text-lg font-bold text-slate-900 mb-5 items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Search</label>
                <input
                  defaultValue={params.get('q') || ''}
                  onBlur={(e) => update('q', e.target.value.trim())}
                  placeholder="iPhone, Honda..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Location</label>
                <input
                  defaultValue={params.get('city') || ''}
                  onBlur={(e) => update('city', e.target.value.trim())}
                  placeholder="e.g. Lahore"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Category</label>
                <select
                  value={params.get('category') || ''}
                  onChange={(e) => update('category', e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    defaultValue={params.get('minPrice') || ''}
                    onBlur={(e) => update('minPrice', e.target.value)}
                    placeholder="Min"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900 transition-all"
                  />
                  <input
                    defaultValue={params.get('maxPrice') || ''}
                    onBlur={(e) => update('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setParams(new URLSearchParams());
                  setIsFilterOpen(false);
                }}
                className="mt-4 h-11 w-full rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate mr-2">
              {params.get('category') ? `${params.get('category').toUpperCase()}` : 'Recommended Items'}
            </h2>
            <div className="shrink-0 text-[10px] md:text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {loading ? '...' : `${pagination.total.toLocaleString()} Items`}
            </div>
          </div>

{loading ? (
  <div className={`grid gap-4 md:gap-6 ${
    isGridView 
      ? 'grid-cols-2 ' // Grid view
      : 'grid-cols-1 w-full'                               // Row view
  }`}>
    {[...Array(6)].map((_, i) => (
      <div key={i} className={`${isGridView ? 'h-64 md:h-72' : 'h-32 md:h-40'} rounded-3xl bg-slate-100 animate-pulse`} />
    ))}
  </div>
) : items.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-12 md:py-20 text-center px-4">
              <div className="text-slate-400 font-bold mb-2 text-lg">No Results Found</div>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <>
   <div className={`grid gap-4 md:gap-6 ${
    isGridView 
      ? 'grid-cols-2' 
      : 'grid-cols-1 w-full'                        
}`}>
  {items.map((it) => (
    <AdCard key={it._id} item={it} />
  ))}
</div>

              {/* Responsive Pagination */}
              <div className="mt-10 mb-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => goPage(pagination.page - 1)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-30 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Prev</span>
                </button>
                
                <div className="text-xs md:text-sm font-bold text-slate-900 px-4 py-2 bg-slate-50 rounded-xl">
                  {pagination.page} / {pagination.pages}
                </div>

                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => goPage(pagination.page + 1)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-30 shadow-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}