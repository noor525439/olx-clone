import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext.jsx';
import React from "react"

function assetUrl(path) {
  const base = import.meta.env.VITE_ASSET_BASE || 'http://localhost:5000';
  if (!path) return '';
  return `${base}${path}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);

  const images = useMemo(() => item?.images || [], [item]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get(`/ads/${id}`, { silent: true })
      .then(({ data }) => alive && setItem(data.item))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Loading…</div>;
  if (!item) return <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Not found.</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="aspect-[4/3] bg-slate-100">
          {images[imgIdx] ? (
            <img className="h-full w-full object-cover" src={assetUrl(images[imgIdx])} alt={item.title} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-auto p-3">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImgIdx(i)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${i === imgIdx ? 'border-slate-900' : 'border-slate-200'}`}
              >
                <img className="h-full w-full object-cover" src={assetUrl(src)} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-bold tracking-tight">{item.title}</h1>
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
              Rs {item.price}
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            <span className="capitalize">{item.category}</span> • {item.city} • {item.location}
          </div>

          <div className="mt-4 whitespace-pre-wrap text-sm text-slate-700">
            {item.description}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => {
                add({ id: item._id, title: item.title, price: item.price, image: item.images?.[0] || '' }, 1);
                navigate('/cart');
              }}
              className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add to cart
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="h-11 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50"
            >
              Buy now
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Seller</div>
          <div className="mt-2 text-sm text-slate-700">{item.seller?.name || 'Unknown'}</div>
          <div className="mt-1 text-sm text-slate-600">{item.seller?.city || ''}</div>
          {item.seller?.phone && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
              Phone: <span className="font-semibold">{item.seller.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

