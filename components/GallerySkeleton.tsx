export default function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
                </div>
            ))}
        </div>
    );
}
