"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setSent(true);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                            <p className="mt-2 text-gray-600">Enter your email to receive reset instructions</p>
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button type="submit" className="w-full" isLoading={isLoading}>Send Link</Button>
                        <p className="text-center text-sm"><Link href="/login" className="text-indigo-600 hover:text-indigo-500">Back to Login</Link></p>
                    </form>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">Check your inbox</h2>
                        <p className="text-gray-600">We have sent a password reset link to {email}</p>
                        <Link href="/login"><Button className="w-full">Back to Login</Button></Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
