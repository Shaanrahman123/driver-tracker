"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    MapPin,
    Clock,
    Car,
    Navigation,
    LifeBuoy,
    ClipboardList,
    Loader2,
    ExternalLink,
    LogOut,
    Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface AttendanceLog {
    id: number;
    date: string;
    timestamp: number;
    latitude: number;
    longitude: number;
    address: string;
    image: string;
    type: string;
    verified: boolean;
}

export default function DriverLogs() {
    const router = useRouter();
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('clock_in');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const attendanceTypes = [
        { id: 'all', label: 'All Activities', icon: ClipboardList },
        { id: 'clock_in', label: 'Clock In', icon: Clock },
        { id: 'clock_out', label: 'Clock Out', icon: ArrowLeft },
        { id: 'pickup', label: 'Pickup', icon: Car },
        { id: 'dropping', label: 'Dropping', icon: Navigation },
        { id: 'breakdown', label: 'Breakdown', icon: LifeBuoy },
    ];

    useEffect(() => {
        fetchLogs();
    }, [currentMonth]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            // In a real app, we'd pass year/month to the API
            const res = await fetch('/api/attendance/logs');
            if (res.ok) {
                const data = await res.json();
                // Filter by current month locally for demo purposes
                const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getTime();
                const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getTime();

                const filtered = data.filter((log: AttendanceLog) => {
                    const logDate = new Date(log.timestamp).getTime();
                    return logDate >= monthStart && logDate <= monthEnd;
                });
                setLogs(filtered);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const changeMonth = (offset: number) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setCurrentMonth(nextMonth);
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const filteredLogs = filterType === 'all'
        ? logs
        : logs.filter(log => log.type === filterType);

    // Aggregation logic for Attendance view (Clock In/Out)
    const renderTable = () => {
        if (filterType === 'clock_in' || filterType === 'clock_out') {
            // Group by date
            const grouped: Record<string, { in?: AttendanceLog; out?: AttendanceLog }> = {};
            logs.forEach(log => {
                if (!grouped[log.date]) grouped[log.date] = {};
                if (log.type === 'clock_in') grouped[log.date].in = log;
                if (log.type === 'clock_out') grouped[log.date].out = log;
            });

            return (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-950/50 text-neutral-500 text-[10px] font-bold uppercase tracking-widest px-8">
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Clock In</th>
                                <th className="px-6 py-5">Clock Out</th>
                                <th className="px-6 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {Object.entries(grouped)
                                .sort((a, b) => b[0].localeCompare(a[0]))
                                .map(([date, data]) => (
                                    <tr key={date} className="group hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="text-sm font-bold text-white">{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {data.in ? (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                                    <span className="text-sm font-medium">{new Date(data.in.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ) : <span className="text-neutral-600">--:--</span>}
                                        </td>
                                        <td className="px-6 py-6">
                                            {data.out ? (
                                                <div className="flex items-center gap-2">
                                                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                                                    <span className="text-sm font-medium">{new Date(data.out.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ) : <span className="text-neutral-600">--:--</span>}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${(data.in?.verified || data.out?.verified) ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {(data.in?.verified || data.out?.verified) ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-950/50 text-neutral-500 text-[10px] font-bold uppercase tracking-widest px-8">
                            <th className="px-6 py-5">Activity</th>
                            <th className="px-6 py-5">DateTime</th>
                            <th className="px-6 py-5">Location</th>
                            <th className="px-6 py-5">Photo</th>
                            <th className="px-6 py-5 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredLogs.map((log) => {
                            const typeInfo = attendanceTypes.find(t => t.id === log.type) || attendanceTypes[1];
                            return (
                                <tr key={log.id} className="group hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'clock_out' ? 'bg-red-500/10 text-red-400' :
                                                log.type === 'clock_in' ? 'bg-indigo-500/10 text-indigo-400' :
                                                    'bg-orange-500/10 text-orange-400'
                                                }`}>
                                                <typeInfo.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-white whitespace-nowrap">{typeInfo.label}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="text-sm font-bold text-white">{new Date(log.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                        <div className="text-xs text-neutral-500 mt-0.5">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-6 min-w-[200px]">
                                        <div className="flex items-center gap-2 group/loc">
                                            <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                                            <span className="text-xs text-neutral-400 line-clamp-1">{log.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="h-12 w-16 relative rounded-lg border border-white/10 bg-neutral-800 overflow-hidden">
                                            {log.image ? (
                                                <Image src={log.image} alt="Activity" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[10px] text-neutral-600 font-bold">N/A</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {log.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/dashboard" className="p-2.5 rounded-xl bg-white/5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all border border-white/5">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Truck className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Track<span className="text-indigo-500">Pro</span></h1>
                    </div>
                    <div className="w-10" />
                </div>
            </header>

            <main className="pt-28 pb-32 px-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    {/* Month Selector */}
                    <div className="flex items-center gap-4 bg-neutral-900/50 border border-white/5 p-2 rounded-2xl w-fit">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-neutral-400" />
                        </button>
                        <div className="flex items-center gap-2 px-2">
                            <CalendarIcon className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-sm min-w-[120px] text-center">{formatMonth(currentMonth)}</span>
                        </div>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                        </button>
                    </div>

                    {/* Filter Type */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar md:pb-0">
                        <Filter className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer pr-10 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23666\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                        >
                            {attendanceTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 text-neutral-500">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                            <p className="font-medium tracking-widest uppercase text-xs">Loading records...</p>
                        </div>
                    ) : filteredLogs.length === 0 && (filterType !== 'clock_in' && filterType !== 'clock_out') ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 text-neutral-500">
                            <ClipboardList className="w-12 h-12 text-neutral-800" />
                            <p className="font-medium tracking-widest uppercase text-xs">No records found for this period.</p>
                        </div>
                    ) : (renderTable())}
                </div>
            </main>
        </div>
    );
}
