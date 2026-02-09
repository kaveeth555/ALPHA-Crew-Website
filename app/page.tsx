import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PhotoGrid from "@/components/PhotoGrid";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />

      <section className="relative pt-20 pb-0 px-6 overflow-hidden">
        {/* Seamless Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/explore-background.jpg"
            alt="Background"
            fill
            className="object-cover opacity-40" // Balanced opacity
            unoptimized
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
          <PhotoGrid limit={12} shuffle={true} compact={true} variant="swipe" />
        </div>
        <Footer />
      </section>
    </main>
  );
}
