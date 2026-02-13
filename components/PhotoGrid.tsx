"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, FreeMode, Zoom, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from "swiper";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';
import 'swiper/css/navigation';

interface Photo {
    _id: string;
    id: number; // Keeping for compatibility, but mainly using _id
    src: string;
    title: string;
    photographer: string;
}

interface PhotoGridProps {
    limit?: number;
    shuffle?: boolean;
    compact?: boolean;
    variant?: 'grid' | 'swipe';
}

export default function PhotoGrid({ limit, shuffle, compact, variant = 'grid' }: PhotoGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [shuffledPhotos, setShuffledPhotos] = useState<Photo[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Navigation Refs for safe Swiper integration
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    // Derived state from URL
    const photoId = searchParams.get("photoId");
    // Check against _id (string) or id (number) for compatibility
    const isLightboxOpen = !!photoId;
    const initialSlideIndex = photoId
        ? shuffledPhotos.findIndex(p => p._id === photoId || p.id === parseInt(photoId))
        : 0;

    useEffect(() => {
        setMounted(true);
        const fetchPhotos = async () => {
            try {
                const res = await fetch('/api/photos');

                // Debug logging
                if (!res.ok) {
                    const text = await res.text();
                    console.error('API Error:', res.status, res.statusText, text);
                    setLoading(false); // Ensure loading state is reset
                    return;
                }

                const text = await res.text();
                // console.log('API Response:', text); // Uncomment to see raw JSON

                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        const fetchedPhotos = data.data.map((p: any, index: number) => ({
                            ...p,
                            id: index + 1
                        }));
                        setPhotos(fetchedPhotos);
                        if (shuffle) {
                            setShuffledPhotos([...fetchedPhotos].sort(() => 0.5 - Math.random()));
                        } else {
                            setShuffledPhotos(fetchedPhotos);
                        }
                    }
                } catch (jsonError) {
                    console.error('JSON Parse Error:', jsonError);
                    console.error('Raw Text causing error:', text);
                }

            } catch (error) {
                console.error("Failed to fetch photos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [shuffle]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
        };
        if (isLightboxOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isLightboxOpen]);

    const openLightbox = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("photoId", id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeLightbox = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("photoId");
        router.push(pathname, { scroll: false });
    };

    let displayedPhotos = shuffledPhotos;
    if (limit) {
        displayedPhotos = displayedPhotos.slice(0, limit);
    }

    if (loading) return null; // Or a skeleton loader if preferred

    // Lightbox Component
    const Lightbox = () => {
        if (!isLightboxOpen || !mounted) return null;

        // If photo ID is invalid (e.g. from bad URL), close lightbox
        if (initialSlideIndex === -1) {
            closeLightbox();
            return null;
        }

        return createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm">
                <Swiper
                    initialSlide={initialSlideIndex}
                    zoom={true}
                    onBeforeInit={(swiper) => {
                        // @ts-ignore
                        swiper.params.navigation.prevEl = prevRef.current;
                        // @ts-ignore
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    keyboard={{ enabled: true }}
                    modules={[Zoom, Navigation]}
                    className="w-full h-full"
                >
                    {displayedPhotos.map((photo) => (
                        <SwiperSlide key={String(photo._id || photo.id)} className="flex items-center justify-center bg-transparent">
                            <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                                <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
                                    <Image
                                        src={photo.src}
                                        alt={photo.title}
                                        fill
                                        unoptimized
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Close Button */}
                <button
                    onClick={closeLightbox}
                    className="absolute top-24 right-4 z-[250] p-2 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full cursor-pointer"
                >
                    <X size={32} />
                </button>

                {/* Navigation Buttons - Using Refs */}
                <button
                    ref={prevRef}
                    className="hidden md:flex absolute left-4 z-[250] p-3 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronLeft size={48} />
                </button>
                <button
                    ref={nextRef}
                    className="hidden md:flex absolute right-4 z-[250] p-3 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronRight size={48} />
                </button>
            </div>,
            document.body
        );
    };

    if (variant === 'swipe') {
        const middleIndex = Math.floor(displayedPhotos.length / 2);

        return (
            <div className="w-full py-10 relative group">
                {/* Left Navigation Zone - Click to swipe Right (Prev) */}
                <div
                    className="absolute top-0 bottom-0 left-0 w-[15%] z-20 cursor-pointer hover:bg-black/5 transition-colors"
                    onClick={() => swiperInstance?.slidePrev()}
                />

                {/* Right Navigation Zone - Click to swipe Left (Next) */}
                <div
                    className="absolute top-0 bottom-0 right-0 w-[15%] z-20 cursor-pointer hover:bg-black/5 transition-colors"
                    onClick={() => swiperInstance?.slideNext()}
                />

                <Swiper
                    onSwiper={setSwiperInstance}
                    // initialSlide removed for loop flow
                    effect={'coverflow'}
                    grabCursor={true}
                    freeMode={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    speed={800} // Smoother transition
                    slideToClickedSlide={true} // Click to swipe
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectCoverflow, Pagination, FreeMode]}
                    className="w-full"
                >
                    {displayedPhotos.map((photo) => (
                        <SwiperSlide key={photo._id} className="!w-[300px] !h-[400px] md:!w-[400px] md:!h-[500px]">
                            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    return (
        <>
            <div className={`${compact
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                }`}>
                {displayedPhotos.map((photo, index) => (
                    <div
                        key={photo._id}
                        onClick={() => openLightbox(photo._id)}
                        className={`group relative aspect-[4/5] overflow-hidden rounded-3xl cursor-pointer ${compact
                            ? "transition-all duration-500 hover:scale-110 hover:z-50 hover:shadow-2xl opacity-80 hover:opacity-100"
                            : ""
                            }`}
                    >
                        <Image
                            src={photo.src}
                            alt={photo.title}
                            fill
                            unoptimized
                            className={`object-cover transition-transform duration-700 ${compact ? "" : "group-hover:scale-110"
                                }`}
                        />

                        {/* Hover Overlay only (no text) */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>

            <Lightbox />
        </>
    );
}
