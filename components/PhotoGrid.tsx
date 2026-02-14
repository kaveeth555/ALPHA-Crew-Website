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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Derived state from URL
    const photoId = searchParams.get("photoId");
    // Check against _id (string) or id (number) for compatibility
    const isLightboxOpen = !!photoId;
    const initialSlideIndex = photoId
        ? photos.findIndex(p => p._id === photoId || p.id === parseInt(photoId))
        : 0;

    const fetchPhotos = async (pageNum: number, isReset: boolean = false) => {
        try {
            if (isReset) setLoading(true);
            else setLoadingMore(true);

            // If limit is provided (e.g. Home page), just fetch that many and no pagination
            const queryLimit = limit || 12;
            const res = await fetch(`/api/photos?page=${pageNum}&limit=${queryLimit}`);

            if (!res.ok) {
                console.error('API Error:', res.status, res.statusText);
                return;
            }

            const data = await res.json();
            if (data.success) {
                const fetchedPhotos = data.data.map((p: any, index: number) => ({
                    ...p,
                    id: index + 1
                }));

                if (isReset) {
                    if (shuffle) {
                        setPhotos([...fetchedPhotos].sort(() => 0.5 - Math.random()));
                    } else {
                        setPhotos(fetchedPhotos);
                    }
                } else {
                    setPhotos(prev => [...prev, ...fetchedPhotos]);
                }

                // If a hard limit is set (like on home page), we don't paginate
                if (limit) {
                    setHasMore(false);
                } else {
                    setHasMore(data.pagination.hasMore);
                }
            }
        } catch (error) {
            console.error("Failed to fetch photos:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        checkMobile();
        window.addEventListener('resize', checkMobile);

        setPage(1);
        fetchPhotos(1, true);

        return () => window.removeEventListener('resize', checkMobile);
    }, [limit, shuffle]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPhotos(nextPage);
    };

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

    if (loading && page === 1) return <div className="text-white/40 text-center py-20">Loading photos...</div>;

    if (variant === 'swipe') {
        return (
            <div className="w-full py-10 relative group">
                {/* Left Navigation Zone */}
                <div
                    className="absolute top-0 bottom-0 left-0 w-[15%] z-20 cursor-pointer hover:bg-black/5 transition-colors"
                    onClick={() => swiperInstance?.slidePrev()}
                />

                {/* Right Navigation Zone */}
                <div
                    className="absolute top-0 bottom-0 right-0 w-[15%] z-20 cursor-pointer hover:bg-black/5 transition-colors"
                    onClick={() => swiperInstance?.slideNext()}
                />

                <Swiper
                    onSwiper={setSwiperInstance}
                    effect={'coverflow'}
                    grabCursor={true}
                    freeMode={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    speed={800}
                    slideToClickedSlide={true}
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
                    style={{ transform: 'translate3d(0,0,0)' }} // Force hardware acceleration
                >
                    {(isMobile ? photos.slice(0, 5) : photos).map((photo, index) => (
                        <SwiperSlide key={photo._id || index} className={`${isMobile ? "!w-[280px] !h-[380px]" : "!w-[300px] !h-[400px] md:!w-[400px] md:!h-[500px]"} will-change-transform`}>
                            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    sizes="(max-width: 768px) 280px, 400px"
                                    className="object-cover"
                                    priority={index < 1}
                                    quality={isMobile ? 50 : 75}
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
            <div className={`space-y-12 ${compact ? "" : "pb-20"}`}>
                <div className={`${compact
                    ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    }`}>
                    {photos.map((photo, index) => (
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
                                sizes={compact ? "(max-width: 768px) 50vw, 16vw" : "(max-width: 768px) 100vw, 33vw"}
                                className={`object-cover transition-transform duration-700 ${compact ? "" : "group-hover:scale-110"
                                    }`}
                            />

                            {/* Hover Overlay only (no text) */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {!compact && hasMore && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loadingMore ? 'Loading Photos...' : 'Load More Works'}
                            {!loadingMore && <ChevronRight size={16} />}
                        </button>
                    </div>
                )}
            </div>

            <Lightbox
                isOpen={isLightboxOpen}
                initialSlideIndex={initialSlideIndex}
                photos={photos}
                onClose={closeLightbox}
                mounted={mounted}
            />
        </>
    );
}

// Extracted Lightbox Component
interface LightboxProps {
    isOpen: boolean;
    initialSlideIndex: number;
    photos: Photo[];
    onClose: () => void;
    mounted: boolean;
}

const Lightbox = ({ isOpen, initialSlideIndex, photos, onClose, mounted }: LightboxProps) => {
    // Navigation Refs for safe Swiper integration
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    if (!isOpen || !mounted) return null;

    // If photo ID is invalid (e.g. from bad URL), close lightbox
    if (initialSlideIndex === -1 && photos.length > 0) {
        onClose();
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
                {photos.map((photo) => (
                    <SwiperSlide key={String(photo._id || photo.id)} className="flex items-center justify-center bg-transparent">
                        <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    sizes="90vw"
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
                onClick={onClose}
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
