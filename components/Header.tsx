"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-[105] transition-all duration-300 flex justify-center ${isScrolled ? 'pt-4' : 'pt-6'}`}>
            <div className={`relative pl-4 pr-8 transition-all duration-300 ${isScrolled
                ? 'h-16 w-[98%] bg-black/80 backdrop-blur-3xl border-white/20'
                : 'h-20 w-[95%] bg-black/40 backdrop-blur-2xl border-white/10'
                } max-w-7xl border rounded-full shadow-2xl flex items-center justify-between`}>

                {/* Left Side: Logo */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="z-50 relative opacity-90 hover:opacity-100 transition-opacity flex items-center h-full w-auto">
                        <Logo variant="short" className={`h-full w-auto origin-left transition-transform duration-300 ${isScrolled ? 'scale-125' : 'scale-150'}`} />
                    </Link>
                </div>

                {/* Desktop Navigation - Centered */}
                <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 text-xs font-medium tracking-[0.2em] text-white/80">
                    <NavLink href="/" text="HOME" />
                    <NavLink href="/gallery" text="GALLERY" />
                    <NavLink href="/about" text="ABOUT" />
                    <NavLink href="/contact" text="CONTACT" />
                </nav>

                {/* Right Side: Social Icons */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-6">
                    <div className="flex items-center gap-4 text-white/60">
                        <a href="https://www.instagram.com/alphacrew_photography/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.facebook.com/alpha.crew.photography1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Facebook size={18} />
                        </a>
                        <a href="mailto:contact@alphacrew.com" className="hover:text-white transition-colors">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-50 relative p-2 text-white/80 hover:text-white transition-colors ml-auto"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation Dropdown - Liquid Glass Style */}
                {isOpen && (
                    <div className="absolute top-16 right-0 mt-2 w-48 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center gap-4 text-sm font-medium tracking-widest md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                        <NavLink href="/" text="HOME" onClick={() => setIsOpen(false)} />
                        <NavLink href="/gallery" text="GALLERY" onClick={() => setIsOpen(false)} />
                        <NavLink href="/about" text="ABOUT" onClick={() => setIsOpen(false)} />
                        <NavLink href="/contact" text="CONTACT" onClick={() => setIsOpen(false)} />
                    </div>
                )}
            </div>
        </header>
    );
}

function NavLink({ href, text, onClick }: { href: string; text: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            className="relative group px-4 py-2 hover:text-white transition-colors"
            onClick={onClick}
        >
            {text}

            {/* Top Border */}
            <span className="absolute top-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />

            {/* Right Border */}
            <span className="absolute top-0 right-0 w-[1px] h-0 bg-white transition-all duration-300 delay-100 group-hover:h-full" />

            {/* Bottom Border */}
            <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-white transition-all duration-300 delay-200 group-hover:w-full" />

            {/* Left Border */}
            <span className="absolute bottom-0 left-0 w-[1px] h-0 bg-white transition-all duration-300 delay-300 group-hover:h-full" />
        </Link>
    );
}
