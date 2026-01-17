"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin, Clock, CheckCircle2, Truck, Navigation, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-neutral-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Truck className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">
                Track<span className="text-indigo-500">Pro</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login">
                <div className="relative p-px rounded-full bg-linear-to-r from-indigo-500 to-purple-600">
                  <div className="bg-neutral-950 rounded-full h-11 flex items-center px-6 text-sm font-bold text-white transition-none cursor-pointer">
                    Member Login
                  </div>
                </div>
              </Link>
              <Link href="/admin">
                <Button className="bg-indigo-600 text-white shadow-none hover:bg-indigo-700 rounded-full h-11 px-6 border-none text-sm font-bold">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="sm:text-center lg:text-left lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Real-time Freight Intelligence
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    Manage Your Trucking <br />
                    <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Fleet with Power.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    The most advanced logistics and attendance system built specifically for heavy-duty trucking operations. Track locations, manage hauling logs, and optimize routes.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                    <Link href="/login">
                      <Button className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/20 group transition-all">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-4 px-6 py-2 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 bg-linear-to-br from-neutral-600 to-neutral-800`} />
                        ))}
                      </div>
                      <span className="text-sm text-neutral-300 font-medium">1,200+ Trucks Monitored</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-16 lg:mt-0 lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative aspect-4/5 sm:aspect-square lg:aspect-4/5 rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src="/truck_fleet.png"
                      alt="Modern Truck Fleet"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>

                    {/* Floating UI Elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <ShieldCheck className="text-green-400 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Logistics Hub</p>
                          <p className="text-sm font-semibold text-white">Encrypted Fleet Sync Active</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Experience Section */}
        <section className="py-24 bg-neutral-900/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-4xl overflow-hidden border border-white/5 shadow-2xl order-2 lg:order-1"
              >
                <Image
                  src="/truck_dashboard.png"
                  alt="Truck Driver Dashboard"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-4xl font-bold mb-6 italic tracking-tight">Heavy Hauling, <br />Lightweight Tech.</h2>
                <div className="space-y-6">
                  {[
                    { title: "Smart Hauling Logs", desc: "Instantly record pickups, drops, and breakdowns. No paperwork, just precision tracking." },
                    { title: "ELD Compliance Ready", desc: "Automate your hours of service and attendance with one-tap status updates." },
                    { title: "Fleet-Wide Visibility", desc: "Stay connected with dispatch through encrypted location sync and visual check-ins." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 border-t border-white/5 relative bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Navigation,
                  title: "Route Optimization",
                  desc: "Maximize fuel efficiency and minimize downtime with smart routing.",
                  color: "indigo"
                },
                {
                  icon: MapPin,
                  title: "Geotagged Proof",
                  desc: "Location-verified photo evidence for every pickup and drop-off.",
                  color: "purple"
                },
                {
                  icon: Activity,
                  title: "Real-time Metrics",
                  desc: "Instant insights into fleet availability and duty status.",
                  color: "blue"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-4xl bg-neutral-900/50 border border-white/5 hover:bg-neutral-900 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">
          &copy; 2026 TrackPro. Heavy Duty Fleet Intelligence.
        </p>
      </footer>
    </div>
  );
}
