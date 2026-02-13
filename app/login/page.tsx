'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (data.success) {
                router.push('/admin');
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white/10 rounded-full">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-8">Admin Access</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/30 mb-4"
                            autoFocus
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/30"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Login'}
                    </button>

                    <div className="text-center">
                        <a href="/" className="text-white/40 text-sm hover:text-white transition-colors">Back to Home</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
