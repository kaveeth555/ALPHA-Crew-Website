import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PhotoGrid from "@/components/PhotoGrid";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import Content from '@/models/Content';

async function getHomeData() {
  await dbConnect();

  const [photos, content] = await Promise.all([
    Photo.find({}).sort({ order: 1, createdAt: -1 }).limit(12).lean(),
    Content.find({}).lean()
  ]);

  const contentMap = content.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  // Serialize _id
  const serializedPhotos = photos.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    id: p._id.toString()
  }));

  return {
    photos: serializedPhotos,
    videoUrl: contentMap['home_video_url'] || 'https://res.cloudinary.com/dnfc7ygik/video/upload/v1771060743/alpha-crew/hero-background.mp4',
    heroTitle: contentMap['home_title'] || 'Capture Your Moments With Us'
  };
}

export default async function Home() {
  const { photos, videoUrl, heroTitle } = await getHomeData();

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <Hero videoUrl={videoUrl} title={heroTitle} />

      <section className="relative pt-20 pb-0 px-6 overflow-hidden">
        {/* Seamless Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/explore-background.jpg"
            alt="Background"
            fill
            className="object-cover opacity-40" // Balanced opacity
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>

        <div className="relative z-10 container mx-auto space-y-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4 pt-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-lg">Explore Our Work</h2>
            <p className="max-w-2xl text-white/80 text-sm leading-relaxed drop-shadow-md">
              We provide authentic and beautiful images that last beyond the moment
            </p>
          </div>
          <div className="flex items-end justify-between px-2">
            <h2 className="text-xl font-medium tracking-widest uppercase text-white/40">Featured Work</h2>
            <Link href="/gallery" className="text-xs font-bold tracking-widest text-white hover:text-white/70 transition-colors uppercase border-b border-white pb-1">
              View More
            </Link>
          </div>
          <Suspense fallback={<div className="text-white/30 text-center py-10">Loading photos...</div>}>
            <PhotoGrid limit={12} shuffle={true} compact={true} variant="swipe" initialPhotos={photos} />
          </Suspense>
        </div>
        <Footer />
      </section>
    </main>
  );
}
