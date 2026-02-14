'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, Edit2, Plus, Save, X, Upload, RefreshCw, LayoutGrid, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Photo {
    _id: string;
    src: string;
    title: string;
    photographer: string;
    order: number;
    createdAt?: string;
}

export default function AdminPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        src: '',
        title: '',
        photographer: '',
        order: 0,
    });
    const [uploading, setUploading] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch('/api/photos?limit=1000');
            if (!res.ok) {
                console.error('Fetch failed:', res.status, await res.text());
                return;
            }
            const data = await res.json();
            if (data.success) {
                setPhotos(data.data as Photo[]);
            }
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        try {
            const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPhotos(photos.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete photo:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, src: data.url }));
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will restore the original 12 photos. Existing photos will remain (unless duplicated). Continue?')) return;
        setSeeding(true);
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert('Photos restored!');
                fetchPhotos();
            } else {
                alert('Failed to restore photos.');
            }
        } catch (error) {
            console.error('Seed error:', error);
        } finally {
            setSeeding(false);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setPhotos([data.data as Photo, ...photos]); // Add new photo to the top
                setShowAddForm(false);
                setFormData({ src: '', title: '', photographer: '', order: 0 });
            }
        } catch (error) {
            console.error('Failed to add photo:', error);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const photoToUpdate = photos.find((p) => p._id === id);
        if (!photoToUpdate) return;

        try {
            const res = await fetch(`/api/photos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(photoToUpdate),
            });
            const data = await res.json();
            if (data.success) {
                setIsEditing(null);
                fetchPhotos();
            }
        } catch (error) {
            console.error('Failed to update photo:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
        const { name, value } = e.target;
        if (id) {
            setPhotos(photos.map(p => p._id === id ? { ...p, [name]: value } : p));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDrop = async (targetIndex: number) => {
        if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

        const newPhotos = [...photos];
        const [movedItem] = newPhotos.splice(draggedItemIndex, 1);
        newPhotos.splice(targetIndex, 0, movedItem);

        setPhotos(newPhotos);
        setDraggedItemIndex(null);

        try {
            const orderedIds = newPhotos.map(p => p._id);
            await fetch('/api/photos/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (err) {
            console.error('Failed to save order', err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
                    <p className="text-white/40">{photos.length} photos in gallery</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-sm"
                    >
                        {seeding ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        Restore Defaults
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full hover:bg-white/90 transition-all font-medium shadow-lg hover:shadow-white/20"
                    >
                        <Plus size={20} /> Add Photo
                    </button>
                </div>
            </header>

            {/* Add Photo Modal / Form */}
            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Add New Photo</h2>

                        <form onSubmit={handleAddSubmit} className="space-y-6">
                            {/* Upload Zone */}
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 transition-all hover:border-white/20 hover:bg-white/10 group relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload size={24} className={uploading ? "animate-bounce" : ""} />
                                    </div>
                                    <div>
                                        {uploading ? (
                                            <p className="font-medium text-blue-400">Uploading...</p>
                                        ) : (
                                            <>
                                                <p className="font-medium text-lg">Click to Upload</p>
                                                <p className="text-white/40 text-sm mt-1">or drag and drop here</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="src"
                                        value={formData.src}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="/uploads/..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="Photo Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Photographer</label>
                                    <input
                                        type="text"
                                        name="photographer"
                                        value={formData.photographer}
                                        onChange={(e) => handleInputChange(e)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-transform active:scale-95"
                                >
                                    Save to Gallery
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gallery Grid - Drag & Drop Enabled */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {photos.map((photo, index) => {
                    const photoId = photo._id;
                    const isItemEditing = isEditing === photoId;

                    if (isItemEditing) {
                        return (
                            <div key={photoId} className="bg-white/5 border border-white/10 rounded-3xl p-4 shadow-xl backdrop-blur-sm aspect-[4/5] flex flex-col justify-center">
                                <form onSubmit={(e) => handleEditSubmit(e, photoId)} className="space-y-4">
                                    <div className="relative w-full h-48 rounded-2xl overflow-hidden opacity-50 mx-auto">
                                        <Image src={photo.src} alt={photo.title} fill className="object-cover" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={photo.title}
                                        onChange={(e) => handleInputChange(e, photoId)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-center"
                                        placeholder="Title"
                                    />
                                    <input
                                        type="text"
                                        name="photographer"
                                        value={photo.photographer}
                                        onChange={(e) => handleInputChange(e, photoId)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-center"
                                        placeholder="Photographer"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="flex-1 bg-green-500/20 text-green-400 py-3 rounded-xl text-xs font-bold hover:bg-green-500/30 transition-colors">Save</button>
                                        <button type="button" onClick={() => setIsEditing(null)} className="flex-1 bg-white/5 text-white/60 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={photoId}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                            className={`group relative aspect-[4/5] overflow-hidden rounded-3xl cursor-move ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-blue-500' : ''}`}
                        >
                            <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay with Admin Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsEditing(photoId)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(photoId)} className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md text-red-400 rounded-full transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-lg drop-shadow-lg">{photo.title}</h3>
                                    <p className="text-white/80 text-sm font-medium drop-shadow-md">{photo.photographer}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
