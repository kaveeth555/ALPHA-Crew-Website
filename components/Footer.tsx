
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="py-10 flex justify-center mt-auto w-full z-10 relative">
            <div className="flex flex-col items-center gap-6 text-white/60">
                <div className="flex items-center justify-center">
                    <Logo variant="full" className="invert scale-50" />
                </div>

                <p className="text-[10px] tracking-widest uppercase">
                    &copy; 2026
                </p>

                <div className="flex gap-6 text-[10px] tracking-widest font-medium uppercase items-center">
                    <a href="https://www.instagram.com/alphacrew_photography/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                    <a href="https://www.facebook.com/alpha.crew.photography1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
                    <a href="#" className="hover:text-white transition-colors">Email</a>
                </div>
            </div>
        </footer>
    );
}
