"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function Hero({
    videoUrl = "/hero-background.mp4",
    title = "Capture Your Moments With Us"
}: {
    videoUrl?: string;
    title?: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Auto-play handled by video tag attributes
    useEffect(() => {
        if (videoRef.current) {
            // Ensure video plays if autoplay didn't trigger for some reason
            if (videoRef.current.paused) {
                videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            }
        }
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-10 transition-opacity duration-1000 ${isPlaying ? 'opacity-40' : 'opacity-100'}`} />
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/explore-background.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoadedData={() => setIsPlaying(true)}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto space-y-8 pt-20">
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter text-white drop-shadow-[0_0_80px_rgba(0,0,0,1)] drop-shadow-[0_0_50px_rgba(0,0,0,1)] drop-shadow-[0_0_25px_rgba(0,0,0,1)]">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl font-light tracking-[0.2em] text-white/90 uppercase drop-shadow-[0_2px_2px_rgba(0,0,100,0.8)]">
                        Because every moment deserves care
                    </p>
                </div>

                <div className="pt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <button
                        onClick={togglePlay}
                        className="group relative inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                    >
                        <span className="sr-only">{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-white opacity-100 drop-shadow-md" />
                        ) : (
                            <>
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1 drop-shadow-md" />
                                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-50 duration-[2000ms]" />
                                <div className="absolute -inset-4 rounded-full border border-white/10 animate-pulse opacity-30" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 z-20 text-center">
                <p className="text-sm font-medium tracking-[0.3em] text-white uppercase animate-bounce-bumpy drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Scroll to Explore
                </p>
            </div>
        </section>
    );
}

function BoxText({ text }: { text: string }) {
    return (
        <span className="italic font-light">{text}</span>
    )
}
