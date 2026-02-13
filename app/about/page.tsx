'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function About() {
    const [team, setTeam] = useState<any[]>([]);
    const [bio, setBio] = useState(`Welcome to ALPHA Crew Photography. Based in Sri Lanka, we are a team of experienced photographers focused on capturing moments that feel real and meaningful.

Photography to us is more than an image. It is about emotion, atmosphere, and storytelling. We specialize in landscape, portrait, and street photography, documenting moments as they naturally happen.

Every photo we create reflects authenticity and connection, turning moments into lasting stories.`);

    useEffect(() => {
        // Fetch Content (Bio)
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    if (data.data.about_bio) setBio(data.data.about_bio);
                }
            })
            .catch(err => console.error('Failed to fetch content:', err));

        // Fetch Team Members
        fetch('/api/team')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setTeam(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch team:', err));
    }, []);

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
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {team.length > 0 ? (
                                team.map((member, index) => (
                                    <div key={member._id || index} className={`flex flex-col gap-3 ${index % 2 !== 0 ? '' : 'md:mt-12'}`}>
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-medium text-white/80 tracking-widest uppercase">{member.name}</p>
                                            <p className="text-xs text-white/50 tracking-wider font-light">{member.role}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback loading state or empty state
                                <div className="col-span-3 text-center py-20 text-white/40">
                                    Loading team...
                                </div>
                            )}
                        </div>
                        <div className="space-y-8 md:pt-12">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold">About Us</h1>
                            <div className="space-y-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {bio}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
