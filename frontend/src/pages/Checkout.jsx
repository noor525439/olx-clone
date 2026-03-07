import { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { useCart } from '../context/CartContext.jsx';
import React from "react"
import { useLocation } from 'react-router-dom';

export default function Checkout() {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({ name: '', phone: '', address: '', city: '' });
//   const [directProduct, setDirectProduct] = useState(null);
  const { state } = useLocation(); // 2. State extract karein
  const directProduct = state?.product;



 const summaryItems = useMemo(() => {
    return directProduct ? [directProduct] : items;
  }, [directProduct, items]);
  
  const total = useMemo(() => {
    return summaryItems.reduce((sum, it) => sum + (Number(it.price) * (it.qty || 1)), 0);
  }, [summaryItems]);

  async function placeOrder(e) {
  e.preventDefault();
  

  const itemsToOrder = directProduct ? [directProduct] : items;

  if (!itemsToOrder || itemsToOrder.length === 0) {
    toast.error("No product selected!");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      items: itemsToOrder.map((it) => ({
        adId: it.ad || it.id || it._id, // Backend expects adId
        title: it.title,
        price: Number(it.price),
        qty: Number(it.qty) || 1,
        image: it.image || ''
      })),
      shipping,
      subtotal: total,
      total: total
    };

    // Step 1: Create Order
    const orderRes = await api.post('/orders', payload);
    console.log("Order Response:", orderRes.data);

    // Backend response structure ke mutabiq ID nikaalein
    const orderId = orderRes.data.order?._id || orderRes.data._id;

    if (!orderId) {
      throw new Error("Order created but ID not found in response");
    }

    // Step 2: Create Payment
    const payRes = await api.post('/payments/create', { orderId });
    
    // Success Cleanup
    sessionStorage.removeItem('buyNowProduct');
    if (!directProduct) clear(); 

    if (payRes.data.redirectUrl) {
      window.location.href = payRes.data.redirectUrl;
    } else {
      toast.success('Order placed successfully!');
    }
    
  } catch (err) {
    console.error("Full Error Object:", err);
    // Zod error ya backend message ko handle karein
    const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
    toast.error('Order Failed: ' + errorMsg);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={placeOrder} className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Shipping details</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input required placeholder="Full name" onChange={(e) => setShipping({...shipping, name: e.target.value})} className="h-11 rounded-xl border px-3 text-sm" />
          <input required placeholder="Phone" onChange={(e) => setShipping({...shipping, phone: e.target.value})} className="h-11 rounded-xl border px-3 text-sm" />
          <input required placeholder="City" onChange={(e) => setShipping({...shipping, city: e.target.value})} className="h-11 rounded-xl border px-3 text-sm" />
          <input required placeholder="Address" onChange={(e) => setShipping({...shipping, address: e.target.value})} className="h-11 rounded-xl border px-3 text-sm sm:col-span-2" />
        </div>
        <button disabled={loading} className="mt-6 h-11 w-full rounded-xl bg-slate-900 text-white font-semibold">
          {loading ? 'Processing...' : 'Place order & pay'}
        </button>
      </form>

      <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold">Order summary</h3>
        <div className="mt-4 space-y-2">
{summaryItems.map((it) => (
  <div key={it.ad || it.id} className="flex justify-between text-sm">
    <span>{it.title} × {it.qty || 1}</span>
    <span className="font-semibold">Rs {Number(it.price) * (it.qty || 1)}</span>
  </div>
))}
        </div>
        <div className="mt-4 border-t pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>Rs {total}</span>
        </div>
      </aside>
    </div>
  );
}