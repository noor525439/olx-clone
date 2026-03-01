import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

const TABS = [
  { id: 'ads', label: 'Ads' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Users' },
];

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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [tab]);

  async function moderateAd(id, patch) {
    await api.patch(`/ads/${id}/moderate`, patch);
    toast.success('Updated');
    load();
  }

  async function blockUser(id, isBlocked) {
    await api.patch(`/users/${id}/block`, { isBlocked });
    toast.success(isBlocked ? 'User blocked' : 'User unblocked');
    load();
  }

  async function updateOrder(id, patch) {
    await api.patch(`/orders/${id}/status`, patch);
    toast.success('Order updated');
    load();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="font-display text-2xl font-bold">Admin panel</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`h-10 rounded-xl px-4 text-sm font-semibold ${
                tab === t.id ? 'bg-slate-900 text-white' : 'border hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Loading…</div>
      ) : tab === 'ads' ? (
        <div className="rounded-3xl border bg-white p-4 shadow-sm overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Seller</th>
                <th className="p-3">City</th>
                <th className="p-3">Status</th>
                <th className="p-3">Approved</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3 font-semibold">{a.title}</td>
                  <td className="p-3">{a.seller?.name || '—'}</td>
                  <td className="p-3">{a.city}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">{String(!!a.isApproved)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => moderateAd(a._id, { isApproved: !a.isApproved })}>
                        Toggle approve
                      </button>
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => moderateAd(a._id, { status: a.status === 'removed' ? 'active' : 'removed' })}>
                        {a.status === 'removed' ? 'Restore' : 'Remove'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : tab === 'orders' ? (
        <div className="rounded-3xl border bg-white p-4 shadow-sm overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3 font-mono text-xs">{o._id}</td>
                  <td className="p-3">{o.user?.name || '—'}</td>
                  <td className="p-3 font-semibold">Rs {o.total}</td>
                  <td className="p-3">{o.payment?.status || 'unpaid'}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => updateOrder(o._id, { status: 'processing' })}>
                        Processing
                      </button>
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => updateOrder(o._id, { status: 'shipped' })}>
                        Shipped
                      </button>
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => updateOrder(o._id, { status: 'delivered' })}>
                        Delivered
                      </button>
                      <button className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50" onClick={() => updateOrder(o._id, { paymentStatus: 'paid' })}>
                        Mark paid
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl border bg-white p-4 shadow-sm overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Blocked</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3 font-semibold">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{String(!!u.isBlocked)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50"
                        onClick={() => blockUser(u._id, !u.isBlocked)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

