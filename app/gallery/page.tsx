import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";

import Link from "next/link";
import Image from "next/image";

export default function Gallery() {
    return (
        <main className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 z-0">
                <Image
                    src="/explore-background.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-50"
                    priority
                    quality={50}
                    sizes="(max-width: 768px) 640px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>
            <Header />
            <div className="pt-32 pb-20 px-6 relative z-10">
                <div className="container mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold">Gallery</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            A collection of moments frozen in time. Explore the world through our lens.
                        </p>
                    </div>
                    <Suspense fallback={<div className="text-white/50 text-center py-20">Loading gallery...</div>}>
                        <PhotoGrid />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </main>
    );
}
