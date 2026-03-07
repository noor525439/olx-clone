import { Link } from 'react-router-dom';
import React from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function AdCard({ item }) {
  const { isGridView } = useCart();

  return (
    <Link
      to={`/products/${item._id}`}
      className={`group overflow-hidden rounded border bg-white shadow-sm transition hover:shadow-md flex ${
        isGridView 
          ? 'flex-col' // Mobile pe 2 columns ke liye
          : 'flex-row items-center h-32 md:h-40' // Full width row ke liye
      }`}
    >
     {/* Image Container */}
<div className={`bg-slate-50 overflow-hidden shrink-0 relative ${
  isGridView 
    ? 'w-full aspect-[4/3] lg:aspect-auto lg:h-40' // Desktop pe fixed height 40 (160px)
    : 'h-full w-32 md:w-48' 
}`}>
  {item.images?.[0] ? (
    <img
      src={(import.meta.env.VITE_ASSET_BASE || 'http://localhost:5000') + item.images[0]}
      alt={item.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      loading="lazy"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
      No image
    </div>
  )}

  {/* Price Tag */}
  {isGridView && (
    <div className="absolute bottom-2 left-2">
      <span className="bg-slate-900/90 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-lg">
        Rs {item.price?.toLocaleString()}
      </span>
    </div>
  )}
</div>
      {/* Content Container */}
      <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="truncate text-[13px] md:text-sm font-bold text-slate-800 uppercase tracking-tight">
            {item.title}
          </h3>
          
          <div className={`mt-1 flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500`}>
            <span className="truncate">{item.city}</span>
            <span className="text-slate-300">•</span>
            <span className="truncate capitalize">{item.category}</span>
          </div>
        </div>

        {/* List View mein Price niche show hogi */}
        {!isGridView && (
          <div className="mt-2">
            <span className="text-sm md:text-base font-black text-slate-900">
              Rs {item.price?.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}