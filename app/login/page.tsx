"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Phone, Mail, Lock, ShieldCheck, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState<"member" | "admin">("member");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const body = loginType === "admin"
                ? { email, password }
                : { phone };

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (res.ok) {
                if (data.role === 'admin') router.push('/admin');
                else router.push('/dashboard');
            } else {
                setError(data.error);
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Dynamic Branding */}
            <div className="hidden md:flex md:w-[45%] lg:w-[55%] relative p-16 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -ml-48 -mb-48" />

                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                        <MapPin className="text-white w-7 h-7" />
                    </div>
                    <span className="text-3xl font-bold tracking-tighter text-white">
                        Track<span className="text-indigo-500">Pro</span>
                    </span>
                </Link>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                            Manage Your <br />
                            <span className="text-indigo-500">Fleet Operations</span> <br />
                            with Confidence.
                        </h1>
                        <p className="mt-8 text-xl text-neutral-400 max-w-lg leading-relaxed">
                            A unified platform for real-time tracking, seamless attendance, and comprehensive fleet management.
                        </p>
                    </motion.div>

                    <div className="mt-12 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050505] bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-neutral-500 italic">
                            Trusted by 1000+ drivers across the globe.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-neutral-500 text-sm">
                    &copy; 2024 TrackPro Fleet Solutions Inc.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative bg-[#0a0a0a]">
                <div className="w-full max-w-sm space-y-10 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Login</h2>
                        <p className="text-neutral-500 text-lg">Choose your access type to continue.</p>
                    </div>

                    <div className="flex p-1.5 bg-neutral-900 rounded-[1.25rem] border border-white/5 shadow-inner">
                        <button
                            onClick={() => setLoginType("member")}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${loginType === "member"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-neutral-500 hover:text-white"
                                }`}
                        >
                            Member Access
                        </button>
                        <button
                            onClick={() => setLoginType("admin")}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${loginType === "admin"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-neutral-500 hover:text-white"
                                }`}
                        >
                            Admin Portal
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={loginType}
                            initial={{ opacity: 0, x: loginType === "member" ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: loginType === "member" ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmit}
                            className={`space-y-6 ${shake ? "animate-shake" : ""}`}
                        >
                            {loginType === "member" ? (
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter Mobile Number"
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-neutral-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-white transition-all text-lg placeholder:text-neutral-600 shadow-xl"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-neutral-500">
                                        Members can login directly with their registered phone number.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Admin Email"
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-neutral-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-white transition-all text-lg placeholder:text-neutral-600 shadow-xl"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-neutral-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-white transition-all text-lg placeholder:text-neutral-600 shadow-xl"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-white text-black hover:bg-neutral-200 rounded-2xl text-lg font-bold shadow-2xl transition-all group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-neutral-600 text-sm">
                            Access restricted to authorized personnel. <br />
                            Contact admin if you can't access your account.
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Shake Keyframes */}
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
}
