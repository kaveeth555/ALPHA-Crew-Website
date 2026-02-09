import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function About() {
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
                            <div className="flex flex-col gap-3 mt-0 md:mt-12">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                                    <Image
                                        src="/photographer-2.png" // User should upload this image
                                        alt="Sasmitha Kalhara"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium text-white/80 tracking-widest uppercase">Sasmitha Kalhara</p>
                                    <p className="text-xs text-white/50 tracking-wider font-light">Photographer</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                                    <Image
                                        src="/photographer-1.jpg" // User should upload this image
                                        alt="Kaveeth Manodhya"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium text-white/80 tracking-widest uppercase">Kaveeth Manodhya</p>
                                    <p className="text-xs text-white/50 tracking-wider font-light">Photographer</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-0 md:mt-12">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                                    <Image
                                        src="/videographer.jpg"
                                        alt="Kevin Feslar"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium text-white/80 tracking-widest uppercase">Kevin Feslar</p>
                                    <p className="text-xs text-white/50 tracking-wider font-light">Videographer</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8 md:pt-12">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold">About Us</h1>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                <p>
                                    Welcome to ALPHA Crew Photography. Based in Sri Lanka, we are a team of experienced photographers focused on capturing moments that feel real and meaningful.
                                </p>
                                <p>
                                    Photography to us is more than an image. It is about emotion, atmosphere, and storytelling. We specialize in landscape, portrait, and street photography, documenting moments as they naturally happen.
                                </p>
                                <p>
                                    Every photo we create reflects authenticity and connection, turning moments into lasting stories.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
