'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";

import { useState } from 'react';
import Image from "next/image";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>('whatsapp');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Failed to submit form', error);
            setStatus('error');
        }
    };

    return (
        <main className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 z-0">
                <Image
                    src="/explore-background.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-50"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>
            <Header />
            <div className="pt-32 pb-20 px-6 flex-grow relative z-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold">Get in Touch</h1>
                            <p className="text-muted-foreground">
                                Ready to book with us? Have a question before getting started?
                                Send us your details through the form below or contact us directly via email or social media
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-white">Email</h3>
                                    <p className="text-muted-foreground">alphacrewphotographs@gmail.com</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Socials</h3>
                                    <div className="flex gap-4 text-muted-foreground">
                                        <a href="https://www.facebook.com/alpha.crew.photography1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
                                        <a href="https://wa.me/94719445640" className="hover:text-white transition-colors">WhatsApp</a>
                                        <a href="https://www.instagram.com/alphacrew_photography/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-2xl font-serif font-bold mb-3">Join Our Crew</h3>
                                <p className="text-muted-foreground mb-4">
                                    Are you a passionate photographer or videographer? We are always looking for new talent to join our team.
                                    Send us your best work!
                                </p>
                                <a
                                    href="https://wa.me/94719445640?text=Hi,%20I'm%20interested%20in%20joining%20the%20Alpha%20Crew!"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-5 py-2.5 rounded-full hover:bg-green-500/20 transition-all group"
                                >
                                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                    <span>Apply via WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                            <h2 className="text-xl font-bold mb-6 text-center">How would you like to connect?</h2>

                            {/* Toggle Switch */}
                            <div className="flex bg-neutral-900 p-1 rounded-xl mb-8 relative">
                                <button
                                    onClick={() => setContactMethod('whatsapp')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${contactMethod === 'whatsapp' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                                >
                                    <MessageCircle size={18} />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => setContactMethod('email')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${contactMethod === 'email' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                                >
                                    <span className="text-lg">@</span>
                                    Email
                                </button>

                                {/* Sliding Background */}
                                <div
                                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg transition-all duration-300 ${contactMethod === 'email' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                                />
                            </div>

                            {contactMethod === 'whatsapp' ? (
                                <div className="text-center py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
                                        <MessageCircle size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Chat on WhatsApp</h3>
                                        <p className="text-white/60 text-sm max-w-xs mx-auto">
                                            The fastest way to reach us. Click below to start a conversation directly.
                                        </p>
                                    </div>
                                    <a
                                        href="https://wa.me/94719445640?text=Hi,%20I'd%20like%20to%20inquire%20about%20a%20photoshoot."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all hover:scale-105 shadow-lg shadow-green-900/20"
                                    >
                                        <MessageCircle size={24} />
                                        Open WhatsApp
                                    </a>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-white/80">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder:text-white/20"
                                            placeholder="Your Name"
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-white/80">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder:text-white/20"
                                            placeholder="your@email.com"
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-white/80">Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none text-white placeholder:text-white/20"
                                            placeholder="Tell me about your project..."
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>

                                    {status === 'success' && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Message sent successfully! We'll get back to you soon.
                                        </div>
                                    )}

                                    {status === 'error' && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            Failed to send message. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <>Sending...</>
                                        ) : (
                                            <>Send via Email</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
