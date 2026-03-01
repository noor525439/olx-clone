import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { useCart } from '../context/CartContext.jsx';
import React from "react"

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [lockedItems, setLockedItems] = useState(null);

  const summaryItems = lockedItems || items;
  const total = useMemo(
    () => summaryItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [summaryItems]
  );

  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  async function placeOrder(e) {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');

    setLoading(true);
    try {
      const payload = {
        items: items.map((it) => ({ adId: it.id, qty: it.qty })),
        shipping,
      };
      const { data } = await api.post('/orders', payload);
      const order = data.order;

      const pay = await api.post('/payments/create', { orderId: order._id });
      setPaymentInfo(pay.data);

      setLockedItems(items);
      // Clear cart right away (so we don't double-order)
      clear();

      if (pay.data.redirectUrl) {
        window.location.href = pay.data.redirectUrl;
      } else {
        toast.success('Order placed. Payment pending.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (summaryItems.length === 0 && !paymentInfo) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
        <div className="font-display text-2xl font-bold">Checkout</div>
        <p className="mt-2 text-sm text-slate-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={placeOrder} className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="font-display text-xl font-semibold">Shipping details</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={shipping.name}
            onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
            placeholder="Full name"
            className="h-11 rounded-xl border px-3 text-sm"
          />
          <input
            required
            value={shipping.phone}
            onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
            placeholder="Phone"
            className="h-11 rounded-xl border px-3 text-sm"
          />
          <input
            required
            value={shipping.city}
            onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
            placeholder="City"
            className="h-11 rounded-xl border px-3 text-sm"
          />
          <input
            required
            value={shipping.address}
            onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
            placeholder="Address"
            className="h-11 rounded-xl border px-3 text-sm sm:col-span-2"
          />
        </div>

        <button
          disabled={loading}
          className="mt-6 h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Place order & pay'}
        </button>

        {paymentInfo && (
          <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm">
            <div className="font-semibold">Payment status</div>
            <div className="mt-1 text-slate-700">
              Mode: <span className="font-semibold">{paymentInfo.mode || 'live'}</span>
            </div>
            {paymentInfo.reference && (
              <div className="mt-1 text-slate-700">
                Reference: <span className="font-semibold">{paymentInfo.reference}</span>
              </div>
            )}
            {!paymentInfo.redirectUrl && (
              <div className="mt-2 text-xs text-slate-600">
                If you provided your gateway API env vars, you’ll get a redirect URL here.
              </div>
            )}
          </div>
        )}
      </form>

      <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
        <div className="font-display text-lg font-semibold">Order summary</div>
        <div className="mt-4 space-y-2">
          {summaryItems.map((it) => (
            <div key={it.id} className="flex items-center justify-between text-sm">
              <div className="text-slate-700">{it.title} × {it.qty}</div>
              <div className="font-semibold">Rs {it.price * it.qty}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-sm font-bold">Rs {total}</span>
        </div>
      </aside>
    </div>
  );
}

