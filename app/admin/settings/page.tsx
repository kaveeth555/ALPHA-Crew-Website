'use client';

import { useState, useEffect } from 'react';
import { Lock, Save, User as UserIcon } from 'lucide-react';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [profileData, setProfileData] = useState({
        username: '',
        name: '',
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setProfileData({
                            username: data.user.username || '',
                            name: data.user.name || '',
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: '' });
        setLoading(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: 'Profile updated successfully' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to update profile' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: 'Password updated successfully' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to update password' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white max-w-2xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-white/40">Manage your profile and security.</p>
            </header>

            {/* Profile Section */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <UserIcon size={16} />
                    </span>
                    Profile Details
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
                        <input
                            type="text"
                            value={profileData.username}
                            onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-white/90 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Lock size={16} />
                    </span>
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">New Password</label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>

                    {status.message && (
                        <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-white/90 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
