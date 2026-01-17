"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Users,
    LayoutDashboard,
    MapPin,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ShieldCheck,
    Settings,
    Truck
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin", exact: true },
        { name: "Teams", icon: Users, href: "/admin/teams" },
        { name: "Live Map", icon: MapPin, href: "/admin/map" },
        { name: "Users", icon: ShieldCheck, href: "/admin/users" },
        { name: "Settings", icon: Settings, href: "/admin/settings" },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#121212] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="h-20 flex items-center px-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Truck className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Track<span className="text-indigo-500">Pro</span></span>
                        </div>
                    </div>

                    <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <span className="text-lg font-bold">Admin Panel</span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-y-auto bg-neutral-950 p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
