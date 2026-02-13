'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Shield, User as UserIcon, KeyRound } from 'lucide-react';

interface User {
    _id: string;
    username: string;
    name?: string;
    role: string;
    permissions: string[];
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        password: '',
        role: 'admin',
        permissions: [] as string[],
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const handleResetPassword = async (id: string, username: string) => {
        if (!confirm(`Reset password for ${username} to 'alpha123'?`)) return;
        try {
            const res = await fetch('/api/users/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id }),
            });
            if (res.ok) {
                alert(`Password for ${username} reset to 'alpha123'`);
            } else {
                alert('Failed to reset password');
            }
        } catch (error) {
            console.error('Failed to reset password', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowAddForm(false);
                setFormData({ username: '', name: '', password: '', role: 'admin', permissions: [] });
                fetchUsers();
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error('Failed to create user', error);
        }
    };

    if (loading) return <div className="p-10 text-white">Loading users...</div>;

    return (
        <div className="text-white">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-white/40">Manage admin access and permissions.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full hover:bg-white/90 font-medium"
                >
                    <Plus size={20} /> Add User
                </button>
            </header>

            {showAddForm && (
                <div className="mb-10 bg-white/5 border border-white/10 p-6 rounded-2xl max-w-xl">
                    <h2 className="text-xl font-bold mb-4">Add New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name (Optional)"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                        >
                            <option value="admin">Admin (Standard)</option>
                            <option value="superadmin">Super Admin (Full Access)</option>
                        </select>

                        {formData.role === 'admin' && (
                            <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
                                <p className="text-sm font-bold text-white/60">Permissions</p>
                                <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.includes('manage_gallery')}
                                        onChange={e => {
                                            const newPerms = e.target.checked
                                                ? [...formData.permissions, 'manage_gallery']
                                                : formData.permissions.filter(p => p !== 'manage_gallery');
                                            setFormData({ ...formData, permissions: newPerms });
                                        }}
                                        className="rounded bg-black/40 border-white/10"
                                    />
                                    Manage Gallery
                                </label>
                                <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.includes('manage_content')}
                                        onChange={e => {
                                            const newPerms = e.target.checked
                                                ? [...formData.permissions, 'manage_content']
                                                : formData.permissions.filter(p => p !== 'manage_content');
                                            setFormData({ ...formData, permissions: newPerms });
                                        }}
                                        className="rounded bg-black/40 border-white/10"
                                    />
                                    Manage Site Content
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white">Cancel</button>
                            <button type="submit" className="bg-white text-black px-6 py-2 rounded-full font-bold">Create User</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user._id} className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {user.role === 'superadmin' ? <Shield size={24} /> : <UserIcon size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{user.name || user.username}</h3>
                            {user.name && <p className="text-white/60 text-sm">@{user.username}</p>}
                            <p className="text-white/40 text-sm capitalize flex items-center gap-2 mt-1">
                                {user.role === 'superadmin' && <Shield size={12} className="text-yellow-400" />}
                                {user.role}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleResetPassword(user._id, user.username)} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-yellow-400 hover:bg-white/10 transition-colors" title="Reset Password">
                                <KeyRound size={18} />
                            </button>
                            <button onClick={() => handleDelete(user._id)} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
