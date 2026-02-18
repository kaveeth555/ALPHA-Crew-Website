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
            className={`group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer ${compact
                ? "transition-all duration-300 hover:scale-105 hover:z-50 hover:shadow-2xl opacity-80 hover:opacity-100"
                : ""
                } ${isLoading ? "bg-white/5" : "bg-transparent"}`}
        >
            <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes={compact ? "(max-width: 768px) 50vw, 16vw" : "(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"}
                className={`object-cover transition-all duration-500 ease-in-out ${compact ? "" : "md:group-hover:scale-105"
                    } ${isLoading ? "scale-100 opacity-0" : "scale-100 opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                priority={index < 2}
                quality={40}
            />

            {/* Hover Overlay only (no text) - Hidden while loading */}
            {!isLoading && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
        </div>
    );
}
