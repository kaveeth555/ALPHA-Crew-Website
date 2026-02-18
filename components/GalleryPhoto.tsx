"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
    _id: string;
    id: number;
    src: string;
    title: string;
    photographer: string;
}

interface GalleryPhotoProps {
    photo: Photo;
    index: number;
    compact?: boolean;
    onClick: () => void;
}

export default function GalleryPhoto({ photo, index, compact, onClick }: GalleryPhotoProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            onClick={onClick}
            className={`group relative aspect-[4/5] overflow-hidden rounded-3xl cursor-pointer ${compact
                ? "transition-all duration-500 hover:scale-110 hover:z-50 hover:shadow-2xl opacity-80 hover:opacity-100"
                : ""
                } ${isLoading ? "animate-pulse bg-white/10" : "bg-transparent"}`}
        >
            <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes={compact ? "(max-width: 768px) 50vw, 16vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={`object-cover transition-all duration-700 ${compact ? "" : "group-hover:scale-110"
                    } ${isLoading ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                priority={index < 2}
                quality={50}
            />

            {/* Hover Overlay only (no text) - Hidden while loading */}
            {!isLoading && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
        </div>
    );
}
