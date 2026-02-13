'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Users, Save, X } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    image: string;
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Photographer',
        image: '',
        order: 0,
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team');
            if (res.ok) {
                const data = await res.json();
                setTeam(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch team', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTeam(team.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete team member', error);
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleEdit = (member: TeamMember) => {
        setFormData({
            name: member.name,
            role: member.role,
            image: member.image,
            order: (member as any).order || 0,
        });
        setEditingId(member._id);
        setShowAddForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? '/api/team' : '/api/team';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, _id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setShowAddForm(false);
                setFormData({ name: '', role: 'Photographer', image: '', order: 0 });
                setEditingId(null);
                fetchTeam();
            } else {
                alert('Failed to save team member');
            }
        } catch (error) {
            console.error('Failed to save team member', error);
        }
    };

    if (loading) return <div className="p-10 text-white">Loading team members...</div>;

    return (
        <div className="text-white max-w-6xl">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                    <p className="text-white/40">Manage your photographers and videographers.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', role: 'Photographer', image: '', order: 0 });
                        setShowAddForm(true);
                    }}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full hover:bg-white/90 font-medium"
                >
                    <Plus size={20} /> Add Member
                </button>
            </header>

            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-md w-full relative">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-white/30 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-white/30 outline-none"
                                >
                                    <option value="Photographer">Photographer</option>
                                    <option value="Videographer">Videographer</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1">Photo</label>
                                <div className="space-y-3">
                                    {/* Preview */}
                                    {formData.image && (
                                        <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-white/20">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Input */}
                                    {!formData.image && (
                                        <div className="flex items-center gap-3">
                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                                                <span>Upload Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const data = new FormData();
                                                        data.append('file', file);

                                                        try {
                                                            const res = await fetch('/api/upload', {
                                                                method: 'POST',
                                                                body: data,
                                                            });

                                                            if (res.ok) {
                                                                const json = await res.json();
                                                                if (json.success) {
                                                                    setFormData({ ...formData, image: json.url });
                                                                }
                                                            } else {
                                                                alert('Upload failed');
                                                            }
                                                        } catch (error) {
                                                            console.error('Upload error:', error);
                                                            alert('Upload failed');
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <span className="text-sm text-white/40">or</span>
                                            <input
                                                type="text"
                                                placeholder="Paste URL"
                                                value={formData.image}
                                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 text-white focus:border-white/30 outline-none text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-white/30 outline-none"
                                />
                                <p className="text-xs text-white/30 mt-1">Lower numbers appear first. Use 2 for the middle position in the first row.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-white/90 transition-colors">
                                    {editingId ? 'Save Changes' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {team.map(member => (
                    <div key={member._id} className="group bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 relative">
                        <div className="relative aspect-[3/4] w-full bg-black/50">
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white/20">
                                    <Users size={48} />
                                </div>
                            )}

                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-2 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-white/20"
                                    title="Edit Member"
                                >
                                    <Save size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="p-2 bg-red-500/80 text-white backdrop-blur-md rounded-full hover:bg-red-600"
                                    title="Remove Member"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white/80">
                                #{(member as any).order || 0}
                            </div>
                        </div>

                        <div className="p-4 text-center">
                            <h3 className="font-bold text-lg text-white">{member.name}</h3>
                            <p className="text-white/50 text-sm">{member.role}</p>
                        </div>
                    </div>
                ))}

                {team.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-2xl text-white/30">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No team members found.</p>
                        <button onClick={() => setShowAddForm(true)} className="text-white underline mt-2 hover:text-white/80">Add your first member</button>
                    </div>
                )}
            </div>
        </div>
    );
}
