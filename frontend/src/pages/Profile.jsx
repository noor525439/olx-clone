import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api';
import React from "react"

export default function Profile() {
  const { user, updateProfile, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const avatarInputRef = useRef(null);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      address: user?.address || '',
    });
  }, [user]);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await refresh();
      toast.success('Profile updated');
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/users/me/avatar', formData);
      if (data.success) {
        await refresh();
        toast.success('Profile picture updated');
      }
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-display text-2xl font-bold">Profile</div>
          <div className="mt-1 text-sm text-slate-600">{user?.email}</div>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          {user?.role || 'user'}
        </span>
      </div>

      {/* Profile picture */}
      <div className="mt-6 flex items-center gap-4">
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onAvatarChange}
          disabled={uploadingAvatar}
        />
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          disabled={uploadingAvatar}
          className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 ring-2 ring-white shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-60"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-500">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
          {uploadingAvatar && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-xs font-medium">
              Uploading…
            </span>
          )}
        </button>
        <div>
          <p className="font-semibold text-slate-800">Profile picture</p>
          <p className="text-sm text-slate-500">Click to upload or change. JPG, PNG or WebP, max 2MB.</p>
        </div>
      </div>

      <form onSubmit={onSave} className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">City</label>
          <input
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Address</label>
          <input
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"
          />
        </div>
        <button
          disabled={saving}
          className="sm:col-span-2 mt-2 h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

