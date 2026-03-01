import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import React from "react";

function assetUrl(path) {
  const base = import.meta.env.VITE_ASSET_BASE || 'http://localhost:5000';
  if (!path) return '';
  return `${base}${path}`;
}

export default function Cart() {
  const { items, remove, setQty, subtotal, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="mt-3 text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-8 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200" 
          to="/products"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="group flex gap-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-hover hover:shadow-md">
              {/* Image Section */}
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-50">
                {it.image ? (
                  <img className="h-full w-full object-cover transition-transform group-hover:scale-110" src={assetUrl(it.image)} alt={it.title} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">No Image</div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{it.title}</h3>
                    <p className="text-sm font-medium text-blue-600 mt-1">Rs {it.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => remove(it.id)} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button 
                      onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                      className="px-3 py-1 hover:bg-slate-200 text-slate-600 font-bold"
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => setQty(it.id, parseInt(e.target.value) || 1)}
                      className="w-10 bg-transparent text-center text-sm font-bold focus:outline-none"
                    />
                    <button 
                      onClick={() => setQty(it.id, it.qty + 1)}
                      className="px-3 py-1 hover:bg-slate-200 text-slate-600 font-bold"
                    >+</button>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Total: Rs {(it.price * it.qty).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
        
        </div>

        {/* Summary Sidebar */}
        <aside className="h-fit sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100/50">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-slate-900">Total Amount</span>
              <span className="font-black text-slate-900 text-xl">Rs {subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-8 h-14 w-full rounded-2xl bg-slate-900 px-6 text-base font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
          >
            Proceed to Checkout
          </button>
          
          <p className="mt-4 text-center text-xs text-slate-400">
            Secure Checkout • 100% Satisfaction Guaranteed
          </p>
        </aside>
      </div>
    </div>
  );
}