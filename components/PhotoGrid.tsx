"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

// Placeholder data - User should upload images to public folder with these names
const photos = [
    // Row 1
    { id: 1, src: "/photo-1.jpg", title: "Photo 1" },
    { id: 7, src: "/photo-7.jpg", title: "Photo 7" },
    { id: 8, src: "/photo-8.jpg", title: "Photo 8" },
    // Row 2
    { id: 3, src: "/photo-3.jpg", title: "Photo 3" },
    { id: 5, src: "/photo-5.jpg", title: "Photo 5" },
    { id: 9, src: "/photo-9.jpg", title: "Photo 9" },
    // Row 3
    { id: 2, src: "/photo-2.jpeg", title: "Photo 2" },
    { id: 6, src: "/photo-6.jpeg", title: "Photo 6" },
    { id: 4, src: "/photo-4.jpeg", title: "Photo 4" },
    // Row 4
    { id: 10, src: "/photo-10.jpg", title: "Photo 10" },
    { id: 11, src: "/photo-11.jpg", title: "Photo 11" },
    { id: 12, src: "/photo-12.jpg", title: "Photo 12" },
];

interface PhotoGridProps {
    limit?: number;
    shuffle?: boolean;
    compact?: boolean;
    variant?: 'grid' | 'swipe';
}

export default function PhotoGrid({ limit, shuffle, compact, variant = 'grid' }: PhotoGridProps) {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [shuffledPhotos, setShuffledPhotos] = useState(photos);

    useEffect(() => {
        if (shuffle) {
            setShuffledPhotos([...photos].sort(() => 0.5 - Math.random()));
        }
    }, [shuffle]);

    let displayedPhotos = shuffledPhotos;

    if (limit) {
        displayedPhotos = displayedPhotos.slice(0, limit);
    }

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
                        <SwiperSlide key={photo.id} className="!w-[300px] !h-[400px] md:!w-[400px] md:!h-[500px]">
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
        <div className={`${compact
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            }`}>
            {displayedPhotos.map((photo) => (
                <div
                    key={photo.id}
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
    );
}
