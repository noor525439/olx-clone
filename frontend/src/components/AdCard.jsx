import { Link } from 'react-router-dom';
import React from 'react';
export default function AdCard({ item }) {
  return (
    <Link
      to={`/products/${item._id}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {item.images?.[0] ? (
          <img
            src={(import.meta.env.VITE_ASSET_BASE || 'http://localhost:5000') + item.images[0]}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-sm font-semibold">{item.title}</h3>
          <span className="shrink-0 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            Rs {item.price}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
          <span className="capitalize">{item.category}</span>
          <span>{item.city}</span>
        </div>
      </div>
    </Link>
  );
}

