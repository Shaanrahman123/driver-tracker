"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MapPin,
    Clock,
    CheckCircle2,
    ExternalLink,
    Activity,
    Calendar,
    Filter,
    Car,
    Navigation,
    LifeBuoy,
    LogOut,
    ChevronDown
} from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
    const [logs, setLogs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("clock_in");

    const attendanceTypes = [
        { id: 'all', label: 'All Activities', icon: Activity },
        { id: 'clock_in', label: 'Clock In', icon: Clock },
        { id: 'clock_out', label: 'Clock Out', icon: LogOut },
        { id: 'pickup', label: 'Pickup', icon: Car },
        { id: 'dropping', label: 'Dropping', icon: Navigation },
        { id: 'breakdown', label: 'Breakdown', icon: LifeBuoy },
    ];

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/logs');
            if (res.ok) setLogs(await res.json());
        } catch (e) { }
        finally { setIsLoading(false); }
    };

    const toggleVerify = async (id: number, currentStatus: boolean) => {
        setLogs(logs.map(log => log.id === id ? { ...log, verified: !currentStatus } : log));

        await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, verified: !currentStatus })
        });
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            log.user_email?.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || log.type === typeFilter;
        const isToday = log.date === todayStr;
        return matchesSearch && matchesType && isToday;
    });

    const stats = [
        { label: "Today's Logs", value: logs.filter(l => l.date === todayStr).length, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Pending Today", value: logs.filter(l => l.date === todayStr && !l.verified).length, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Verified Today", value: logs.filter(l => l.date === todayStr && l.verified).length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Live Operations</h1>
                    <p className="text-neutral-400 mt-2">Managing your fleet's real-time activities.</p>
                </div>
                <div className="flex items-center gap-3 bg-neutral-900 px-5 py-3 rounded-2xl border border-white/5 shadow-xl">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <span className="text-white font-bold">{formatDate(new Date().toISOString())}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:bg-neutral-900 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] rounded-full opacity-20 -mr-16 -mt-16`} />
                        <div className="flex items-center justify-between relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-4xl font-bold mt-2 text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Today's Attendance Logs</h2>
                        <p className="text-sm text-neutral-500">Real-time update from drivers on the field.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Type Filter */}
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="pl-11 pr-10 py-3 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-white appearance-none cursor-pointer hover:border-white/10 transition-all shadow-lg"
                            >
                                {attendanceTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Search driver..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 pr-4 py-3 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-white placeholder:text-neutral-600 w-full sm:w-64 shadow-lg transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-950/50 text-neutral-500 text-[10px] font-bold uppercase tracking-widest px-8">
                                <th className="px-8 py-5">Driver</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Time</th>
                                <th className="px-8 py-5">Location</th>
                                <th className="px-8 py-5">Photo</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500 mb-4" />
                                        <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Loading data...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log) => {
                                const typeInfo = attendanceTypes.find(t => t.id === log.type) || attendanceTypes[1];
                                return (
                                    <tr key={log.id} className="group hover:bg-white/2 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-inner">
                                                    {log.user_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{log.user_name}</div>
                                                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{log.phone || log.user_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.type === 'clock_out' ? 'bg-red-500/10 text-red-400' :
                                                    log.type === 'clock_in' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-orange-500/10 text-orange-400'
                                                    }`}>
                                                    <typeInfo.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-white whitespace-nowrap uppercase tracking-wider">{typeInfo.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-neutral-300">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 group/loc max-w-[180px]">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                                                <span className="text-xs text-neutral-400 truncate" title={log.address}>{log.address}</span>
                                            </div>
                                            <a
                                                href={`https://maps.google.com/?q=${log.latitude},${log.longitude}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View Live <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="h-14 w-20 relative rounded-xl overflow-hidden border border-white/5 bg-neutral-800 shadow-xl">
                                                {log.image ? (
                                                    <Image src={log.image} alt="Log evidence" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-[10px] text-neutral-600 font-bold tracking-tighter">N/A</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${log.verified
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${log.verified ? 'bg-green-400' : 'bg-yellow-400'} shadow-sm`} />
                                                {log.verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => toggleVerify(log.id, !!log.verified)}
                                                className={`text-[11px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl border ${log.verified
                                                    ? 'text-neutral-500 border-white/5 hover:border-neutral-700'
                                                    : 'text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white hover:shadow-xl hover:shadow-indigo-600/20'
                                                    }`}
                                            >
                                                {log.verified ? 'Unverify' : 'Verify'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredLogs.length === 0 && !isLoading && (
                        <div className="py-24 text-center">
                            <Activity className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">No logs found for today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
