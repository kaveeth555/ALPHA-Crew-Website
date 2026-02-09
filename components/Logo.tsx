import Image from "next/image";

interface LogoProps {
    variant?: "full" | "short";
    className?: string;
}

export default function Logo({ variant = "full", className }: LogoProps) {
    const src = variant === "full" ? "/logo-full.png" : "/logo-short.png";
    const alt = variant === "full" ? "ALPHA Crew Photography" : "ALPHA Crew";
    // Adjust dimensions as needed based on your actual logo aspect ratio
    const width = variant === "full" ? 180 : 120;
    const height = variant === "full" ? 40 : 120;

    return (
        <div className={`relative flex items-center ${className}`}>
            {/* 
                NOTE: Ensure 'public/logo-full.png' and 'public/logo-short.png' exist.
                If not, this will show the alt text or a broken image.
             */}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-contain"
                priority
            />
        </div>
    );
}
