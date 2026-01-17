"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Search,
    Trash2,
    Mail,
    Phone,
    User as UserIcon,
    ShieldCheck,
    X,
    Loader2,
    Edit2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TeamMember {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    gender: string | null;
    role: string;
}

export default function TeamsPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "Male",
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                setMembers(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                email: member.email || "",
                phone: member.phone,
                gender: member.gender || "Male",
            });
        } else {
            setEditingMember(null);
            setFormData({ name: "", email: "", phone: "", gender: "Male" });
        }
        setIsModalOpen(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            const method = editingMember ? "PATCH" : "POST";
            const body = editingMember ? { ...formData, id: editingMember.id } : formData;

            const res = await fetch("/api/admin/users", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                if (editingMember) {
                    setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
                } else {
                    setMembers([data, ...members]);
                }
                setIsModalOpen(false);
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (e) {
            setError("Failed to connect to server");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this member?")) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setMembers(members.filter(m => m.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.includes(search) ||
        (m.email?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
                    <p className="text-neutral-400 mt-2">Manage your fleet drivers and team members.</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search by name, phone or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-neutral-600"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-neutral-400 font-medium tracking-tight">Loading your team...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="group relative bg-neutral-900/50 border border-white/5 rounded-3xl p-6 hover:bg-neutral-900 hover:border-indigo-500/30 transition-all duration-300 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full -mr-12 -mt-12" />

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                                    <UserIcon className="w-7 h-7" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenModal(member)}
                                        className="p-2.5 text-neutral-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                                        title="Edit Member"
                                    >
                                        <Edit2 className="w-4.5 h-4.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                        title="Delete Member"
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-4 text-white">{member.name}</h3>

                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-medium">{member.phone}</span>
                                </div>
                                {member.email && (
                                    <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                            <Mail className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm font-medium truncate">{member.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-300 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-medium">{member.gender || 'Not specified'}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                                <span className={`px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/10 shadow-sm`}>
                                    Active Driver
                                </span>
                                <Users className="w-4 h-4 text-neutral-700" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-neutral-900 border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-neutral-900/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{editingMember ? "Edit Member" : "Add New Member"}</h2>
                                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {editingMember ? "Update existing credentials" : "Configure new driver access"}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-neutral-800 rounded-2xl transition-all border border-white/5 shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-neutral-700 font-medium text-white shadow-inner"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Mobile Number</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-neutral-700 font-medium text-white shadow-inner"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-medium text-white shadow-inner cursor-pointer"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute right-5 bottom-4.5 pointer-events-none">
                                        <Users className="w-4 h-4 text-neutral-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-neutral-700 font-medium text-white shadow-inner"
                                    placeholder="driver@trackpro.net"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-16 rounded-2xl bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isSubmitting}
                                    className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white shadow-2xl shadow-indigo-600/30 border-none group"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                                        <span className="flex items-center justify-center gap-2">
                                            {editingMember ? "Save Changes" : "Create Member"}
                                            <ShieldCheck className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
