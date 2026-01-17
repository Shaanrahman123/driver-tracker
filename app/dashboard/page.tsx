"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
    Camera,
    MapPin,
    CheckCircle2,
    LogOut,
    Home,
    ClipboardList,
    User,
    Loader2,
    Navigation,
    Clock,
    Car,
    LifeBuoy,
    Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
    const router = useRouter();
    const [view, setView] = useState<'home' | 'logs'>('home');
    const [status, setStatus] = useState<'idle' | 'capturing' | 'review' | 'success'>('idle');
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number, address: string } | null>(null);
    const [selectedType, setSelectedType] = useState<string>('clock_in');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);

    const attendanceTypes = [
        { id: 'clock_in', label: 'Clock In', icon: Clock },
        { id: 'clock_out', label: 'Clock Out', icon: LogOut },
        { id: 'pickup', label: 'Pickup', icon: Car },
        { id: 'dropping', label: 'Dropping', icon: Navigation },
        { id: 'breakdown', label: 'Breakdown', icon: LifeBuoy },
    ];

    useEffect(() => {
        if (view === 'logs') {
            router.push('/dashboard/logs');
        }
    }, [view, router]);

    const startCamera = async () => {
        setStatus('capturing');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ lat: latitude, lng: longitude, address: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}` });
                }, () => {
                    setLocation({ lat: 0, lng: 0, address: "Location Unavailable" });
                });
            }
        } catch (err) {
            alert("Camera permission denied. Please enable camera access.");
            setStatus('idle');
        }
    };

    const capture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Flip for horizontal mirror if using front camera
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(videoRef.current, 0, 0);
            }
            setImage(canvas.toDataURL('image/jpeg', 0.8));

            const stream = videoRef.current.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());

            setStatus('review');
        }
    };

    const submit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/attendance/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image,
                    latitude: location?.lat || 0,
                    longitude: location?.lng || 0,
                    address: location?.address || "Unknown",
                    type: selectedType
                })
            });
            if (res.ok) {
                setStatus('success');
            } else {
                throw new Error("Failed to submit");
            }
        } catch (e) {
            alert("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Truck className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Track<span className="text-indigo-500">Pro</span></span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-all border border-white/5 shadow-sm"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="pt-28 pb-32 px-6 max-w-xl md:max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                        >
                            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 overflow-hidden group">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                                        <Camera className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Ready to Go?</h2>
                                    <p className="text-neutral-400 text-sm md:text-lg mb-8 md:mb-12 leading-relaxed">Capture your presence and share your status with the team instantly.</p>
                                    <Button
                                        onClick={startCamera}
                                        className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-600/20 group"
                                    >
                                        Start Check-in
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="ml-2 inline-block"
                                        >
                                            <Navigation className="w-5 h-5 rotate-90" />
                                        </motion.span>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[2rem] bg-neutral-900/50 border border-white/5">
                                    <div className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Today</div>
                                    <div className="text-xl md:text-2xl font-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-neutral-900/50 border border-white/5">
                                    <div className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Status</div>
                                    <div className="text-xl md:text-2xl font-bold text-green-400 italic">ON DUTY</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === 'capturing' && (
                        <motion.div
                            key="capturing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-neutral-900 aspect-3/4 border border-white/10 shadow-2xl">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
                                    <button
                                        onClick={capture}
                                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
                                    >
                                        <div className="w-14 h-14 rounded-full border-2 border-black/10" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const stream = videoRef.current?.srcObject as MediaStream;
                                        stream?.getTracks().forEach(t => t.stop());
                                        setStatus('idle');
                                    }}
                                    className="absolute top-6 right-6 p-3 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors"
                                >
                                    <CheckCircle2 className="w-6 h-6 rotate-45" />
                                </button>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setStatus('idle')}
                                className="w-full py-4 text-neutral-400 font-bold"
                            >
                                Cancel
                            </Button>
                        </motion.div>
                    )}

                    {status === 'review' && image && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="relative rounded-[2.5rem] overflow-hidden aspect-3/4 border border-white/10 shadow-2xl group">
                                <Image src={image} alt="Captured" fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

                                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Location Verified</p>
                                            <p className="text-xs font-bold text-white truncate max-w-[180px]">{location?.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Select Activity Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {attendanceTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${selectedType === type.id
                                                ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20"
                                                : "bg-neutral-900 border-white/5 text-neutral-500 hover:border-white/10"
                                                }`}
                                        >
                                            <type.icon className={`w-5 h-5 ${selectedType === type.id ? "text-white" : "text-neutral-500"}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedType === type.id ? "text-white" : "text-neutral-500"}`}>{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    disabled={loading}
                                    onClick={submit}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Attendance"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setStatus('capturing')}
                                    className="w-full py-4 text-neutral-500 font-bold text-sm"
                                >
                                    Retake Photo
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center py-12 text-center"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full" />
                                <div className="relative w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/40">
                                    <CheckCircle2 className="w-12 h-12 text-black" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-extrabold mb-3">Attendance Marked</h2>
                            <p className="text-neutral-400 text-lg max-w-[240px] leading-relaxed mb-10">
                                Your current status has been recorded. Have a safe journey!
                            </p>
                            <Button
                                onClick={() => setStatus('idle')}
                                className="w-full h-16 rounded-2xl bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-lg font-bold"
                            >
                                Back to Dashboard
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 w-full bg-[#050505]/80 backdrop-blur-2xl border-t border-white/5 z-40 pb-safe">
                <div className="max-w-md mx-auto flex justify-around items-center h-20 px-6">
                    <button
                        onClick={() => setView('home')}
                        className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${view === 'home' ? 'text-indigo-500 scale-110' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        <Home className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                    </button>
                    <button
                        onClick={() => setView('logs')}
                        className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${view === 'logs' ? 'text-indigo-500 scale-110' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        <ClipboardList className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Logs</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
