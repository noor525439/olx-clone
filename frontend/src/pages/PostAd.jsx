import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import React from "react"

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

export default function PostAd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'mobiles',
    city: '',
    location: '',
    stockQty: '1',
  });
  const [images, setImages] = useState([]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((f) => fd.append('images', f));

      const { data } = await api.post('/ads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Ad posted!');
      navigate(`/products/${data.item._id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm">
      <div className="font-display text-2xl font-bold">Post an ad</div>
      <p className="mt-1 text-sm text-slate-600">Add title, category, price, location and images.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
            placeholder="e.g. iPhone 13 PTA approved"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border bg-white px-3 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Price (Rs)</label>
          <input
            required
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
            placeholder="e.g. 45000"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">City</label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
            placeholder="e.g. Karachi"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Location</label>
          <input
            required
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
            placeholder="e.g. Gulshan"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Stock Qty (optional)</label>
          <input
            value={form.stockQty}
            onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
            placeholder="1"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-1 min-h-28 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Write details..."
          />
        </div>
<div className="sm:col-span-2">
  <label className="text-xs font-semibold text-slate-700 block mb-2">
    Images (Max 8)
  </label>
  
  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-blue-400 transition-colors cursor-pointer relative">
    <div className="space-y-1 text-center">
      {/* Upload Icon */}
      <svg
        className="mx-auto h-12 w-12 text-slate-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      <div className="flex text-sm text-slate-600">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
        >
          <span>Upload files</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="sr-only" // Yeh asli button ko hide kar deta hai
            onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 8))}
          />
        </label>
        <p className="pl-1">or drag and drop</p>
      </div>
      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  </div>
</div>

        <button
          disabled={loading}
          className="sm:col-span-2 mt-2 h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Posting…' : 'Post ad'}
        </button>
      </form>
    </div>
  );
}

