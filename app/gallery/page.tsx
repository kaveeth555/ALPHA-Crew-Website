import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import GallerySkeleton from "@/components/GallerySkeleton";
import Link from "next/link";
import Image from "next/image";
import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';

async function getGalleryPhotos() {
    await dbConnect();
    const photos = await Photo.find({})
        .sort({ order: 1, createdAt: -1 })
        .limit(6) // Reduced limit to prevent mobile crash on load more
        .lean();

    return photos.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString()
    }));
}

export default async function Gallery() {
    const initialPhotos = await getGalleryPhotos();

    return (
        <main className="min-h-screen flex flex-col relative bg-black text-white">
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
                style={{ backgroundImage: "url('/explore-background.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>
            <Header />
            <div className="pt-32 pb-20 px-6 relative z-10">
                <div className="container mx-auto space-y-12">
                    <div className="space-y-4 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight drop-shadow-lg">Gallery</h1>
                        <p className="text-white/70 max-w-2xl text-sm md:text-base leading-relaxed drop-shadow-md mx-auto md:mx-0">
                            A collection of moments frozen in time. Explore the world through our lens.
                        </p>
                    </div>
                    <Suspense fallback={<GallerySkeleton />}>
                        <PhotoGrid initialPhotos={initialPhotos} limit={6} />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </main>
    );
}
