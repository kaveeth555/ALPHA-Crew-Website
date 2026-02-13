'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ContentPage() {
    const [content, setContent] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            if (res.ok) {
                const data = await res.json();
                setContent(data.data || {});
            }
        } catch (error) {
            console.error('Failed to fetch content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: string) => {
        setSaving(true);
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            // Update local state is handled by input change, but we could re-fetch
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="p-10 text-white">Loading content...</div>;

    return (
        <div className="text-white max-w-4xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Site Content</h1>
                <p className="text-white/40">Manage global website settings and text.</p>
            </header>

            <div className="space-y-8">
                {/* Home Page Section */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Home Page
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Hero Video URL (Background)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={content.home_video_url || ''}
                                    onChange={e => handleChange('home_video_url', e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                                    placeholder="/hero-background.mp4"
                                />
                                <button
                                    onClick={() => handleSave('home_video_url', content.home_video_url)}
                                    className="bg-white text-black px-4 rounded-xl font-bold hover:bg-white/90"
                                >
                                    <Save size={20} />
                                </button>
                            </div>
                            <p className="text-xs text-white/30 mt-2">Link to a video file (MP4) or a YouTube embed link (if supported).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Hero Title</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={content.home_title || ''}
                                    onChange={e => handleChange('home_title', e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                                    placeholder="We Are Alpha Crew"
                                />
                                <button
                                    onClick={() => handleSave('home_title', content.home_title)}
                                    className="bg-white text-black px-4 rounded-xl font-bold hover:bg-white/90"
                                >
                                    <Save size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Page Section */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        About Page
                    </h2>

                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">About Page Bio</label>
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={content.about_bio || ''}
                                    onChange={e => handleChange('about_bio', e.target.value)}
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-white"
                                    placeholder="Enter biography..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSave('about_bio', content.about_bio)}
                                        className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-white/90 flex items-center gap-2"
                                    >
                                        <Save size={18} /> Save Bio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </div >
    );
}
