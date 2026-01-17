"use client";

import { Activity } from "lucide-react";

export default function AdminPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center py-40 gap-4 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500">
                <Activity className="w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold">This module is under development</h1>
            <p className="text-neutral-500">We're working hard to bring this feature to you soon.</p>
        </div>
    );
}
