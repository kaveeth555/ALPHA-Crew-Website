'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Users, FileText, LogOut, Settings, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; name?: string; role: string; permissions: string[] } | null>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };

        fetchUser();
    }, [router]);

    // Handle scroll for mobile header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    const navItems = [
        { href: '/admin', label: 'Gallery', icon: LayoutGrid, permission: 'manage_gallery' },
        { href: '/admin/content', label: 'Site Content', icon: FileText, permission: 'manage_content' },
        { href: '/admin/team', label: 'Team', icon: Users, permission: 'manage_content' },
        { href: '/admin/users', label: 'User Management', icon: Users, role: 'superadmin' },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row font-sans relative">
            {/* Mobile Header */}
            <header
                className={`md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-300 border-b border-white/5 
                ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-1 px-4 shadow-lg' : 'bg-black/40 backdrop-blur-xl p-4'}`}
            >
                <div className={`transition-all duration-300 ${isScrolled ? 'w-12' : 'w-24'}`}>
                    <img
                        src="/logo-full.png"
                        alt="Alpha Crew Logo"
                        className="w-full h-auto object-contain brightness-0 invert"
                    />
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-white/80 hover:text-white"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen z-50
                    w-64 bg-black/90 md:bg-black/40 backdrop-blur-xl border-r border-white/5 
                    flex flex-col p-6 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="flex flex-col items-center justify-center mb-8 mt-6 md:flex hidden">
                    <div className="w-28 sm:w-32 hover:scale-105 transition-transform duration-500">
                        <img
                            src="/logo-full.png"
                            alt="Alpha Crew Logo"
                            className="w-full h-auto object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 md:hidden">
                    <span className="text-lg font-bold text-white/90">Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-white/60 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        // Permission Check
                        if (user?.role !== 'superadmin') {
                            if (item.role === 'superadmin') return null;
                            if (item.permission && !user?.permissions?.includes(item.permission)) return null;
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-white text-black'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2 mt-auto">
                    <Link href="/" className="flex items-center gap-3 p-3 text-white/50 hover:text-white transition-colors block">
                        <LogOut size={20} className="rotate-180" />
                        Back to Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 text-red-400/50 hover:text-red-400 transition-colors w-full text-left"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main ref={mainRef} className="flex-1 flex flex-col md:overflow-y-auto md:h-screen">
                <header className="px-6 md:px-12 py-6 hidden md:flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-light tracking-wide text-white/80">
                            Welcome, <span className="font-bold text-white">{user?.name || user?.username || 'Admin'}</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${user?.role === 'superadmin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                            </span>
                            {user?.name && <span className="text-xs text-white/40">@{user.username}</span>}
                        </div>
                    </div>
                </header>

                {/* Mobile Welcome Header */}
                <div className="px-6 py-4 pt-24 md:hidden border-b border-white/5 bg-black/20">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-light tracking-wide text-white/80">
                            Hi, <span className="font-bold text-white">{user?.name || user?.username || 'Admin'}</span>
                        </h2>
                    </div>
                </div>

                <div className="p-4 md:p-12 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
