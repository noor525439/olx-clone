import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import React from 'react';

const TABS = [
  { id: 'ads', label: 'Ads Management' },
  { id: 'orders', label: 'Recent Orders' },
  { id: 'users', label: 'User Control' },
];

// Helper Badge Component
const Badge = ({ children, variant = 'slate' }) => {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-rose-50 text-rose-700 border-rose-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100'
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default function AdminPanel() {
  const [tab, setTab] = useState('ads');
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  async function load() {
    setLoading(true);
    try {
      if (tab === 'ads') {
        const { data } = await api.get('/ads/admin/all?limit=30', { silent: true });
        setAds(data.items || []);
      } else if (tab === 'orders') {
        const { data } = await api.get('/orders', { silent: true });
        setOrders(data.orders || []);
      } else {
        const { data } = await api.get('/users', { silent: true });
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]);

  // Actions
  const moderateAd = async (id, patch) => {
    await api.patch(`/ads/${id}/moderate`, patch);
    toast.success('Ad status updated');
    load();
  };

  const blockUser = async (id, isBlocked) => {
    await api.patch(`/users/${id}/block`, { isBlocked });
    toast.success(isBlocked ? 'User restricted' : 'User access restored');
    load();
  };

  const updateOrder = async (id, patch) => {
    await api.patch(`/orders/${id}/status`, patch);
    toast.success('Order status updated');
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Control</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your marketplace operations and users.</p>
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t.id ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  {tab === 'ads' && <>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Item Details</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Seller</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Moderation</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </>}
                  {tab === 'orders' && <>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Update Status</th>
                  </>}
                  {tab === 'users' && <>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">User Profile</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Account Role</th>
                    <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Access Control</th>
                  </>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* --- ADS TABLE --- */}
                {tab === 'ads' && ads.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{a.city}</div>
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600">{a.seller?.name || 'Unknown'}</td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        <Badge variant={a.isApproved ? 'green' : 'amber'}>{a.isApproved ? 'Approved' : 'Pending'}</Badge>
                        <Badge variant={a.status === 'active' ? 'blue' : 'red'}>{a.status}</Badge>
                      </div>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button 
                        onClick={() => moderateAd(a._id, { isApproved: !a.isApproved })}
                        className="text-[11px] font-bold px-4 py-2 rounded-xl border border-slate-200 hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        {a.isApproved ? 'Reject' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => moderateAd(a._id, { status: a.status === 'removed' ? 'active' : 'removed' })}
                        className="text-[11px] font-bold px-4 py-2 rounded-xl text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        {a.status === 'removed' ? 'Restore' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}

                {/* --- ORDERS TABLE --- */}
                {tab === 'orders' && orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-tighter">#{o._id.slice(-8)}</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{o.user?.name || 'Guest'}</div>
                    </td>
                    <td className="p-5 font-black text-slate-900">Rs {o.total.toLocaleString()}</td>
                    <td className="p-5">
                      <Badge variant={o.status === 'delivered' ? 'green' : 'amber'}>{o.status}</Badge>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      {['processing', 'shipped', 'delivered'].map((s) => (
                        <button 
                          key={s}
                          onClick={() => updateOrder(o._id, { status: s })}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${o.status === s ? 'bg-black text-white border-black' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}

                {/* --- USERS TABLE --- */}
                {tab === 'users' && users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                          <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <Badge variant={u.role === 'admin' ? 'blue' : 'slate'}>{u.role}</Badge>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        disabled={u.role === 'admin'}
                        onClick={() => blockUser(u._id, !u.isBlocked)}
                        className={`text-[11px] font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm ${
                          u.isBlocked 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-rose-600'
                        }`}
                      >
                        {u.isBlocked ? 'Unlock Account' : 'Restrict Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}