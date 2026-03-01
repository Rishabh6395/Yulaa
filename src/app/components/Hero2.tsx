"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner"
import { BackgroundBeams } from "@/components/ui/background-beams";
import LocomotiveScroll from 'locomotive-scroll';




const Hero2 = () => {
    // Array of images, text, and prices for the cards
    const router = useRouter()
    const [hovered, setHovered] = useState(null)
    const scrollRef = useRef(null); // reference to scroll container
    const locoScrollInstance = useRef<LocomotiveScroll | null>(null);

    const features = [
        {
            title: "Admissions Portal",
            icon: "🎓",
            route: "/admissions",
            available: true,
            des: "Multi-step application form with guardian details, academic history, and admin approval workflow."
        },
        {
            title: "Smart Attendance",
            icon: "✅",
            route: "/attendance",
            available: true,
            des: "QR code check-ins, manual marking by teachers, real-time stats and downloadable reports."
        },
        {
            title: "Homework Tracker",
            icon: "📚",
            route: "/homework",
            available: true,
            des: "Assign tasks by subject with due dates, submission uploads, and overdue notifications."
        },
        {
            title: "Announcements",
            icon: "📢",
            route: "/announcements",
            available: true,
            des: "School-wide broadcast for events, holidays, and alerts with role-based posting permissions."
        },
        {
            title: "Fee Management",
            icon: "💳",
            route: "/fees",
            available: false,
            des: "Invoice generation, online payments, donation campaigns with progress tracking and receipts."
        },
        {
            title: "Exam Results",
            icon: "📊",
            route: "/exam",
            available: false,
            des: "Upload marks, auto-grade, monthly & quarterly trend charts per subject and student."
        },
        {
            title: "Transport Tracking",
            icon: "🚌",
            route: "/transport",
            available: false,
            des: "Multiple bus routes with live GPS tracking, ETA estimates, and seat availability."
        },
        {
            title: "Accessories Shop",
            icon: "🛍️",
            route: "/accessories",
            available: false,
            des: "Order uniforms, textbooks, and school supplies with a cart system and delivery tracking."
        }
    ]

    const handleClick = (feature: any) => {
        if (feature.available) {
            router.push(feature.route)
        } else {
            toast("This feature is coming soon 🚀")
            console.log("toast")
        }
    }

    useEffect(() => {
        if (!scrollRef.current) return;
        locoScrollInstance.current = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
        });
        return () => {
            if (locoScrollInstance.current) {
                locoScrollInstance.current.destroy();
                locoScrollInstance.current = null;
            }
        };
    }, []);

    return (
        <div ref={scrollRef}
            data-scroll-container
            style={{ overflow: "hidden" }}
            className="bg-black text-white p-10 flex flex-col relative">

            <div className="relative z-10 p-10 flex flex-col">
                <div className="justify-center items-center flex flex-col text-center">
                    <h1 className="text-[2.8rem] font-bold mb-4">Platform Overview</h1>
                    <div className="text-3xl font-semibold mb-6">
                        Everything a school needs, nothing it doesn&apos;t
                    </div>
                    <div className="mb-6">
                        Built with modern technologies for speed, reliability, and an
                        exceptional user experience.
                    </div>
                </div>
                <hr className="border-t border-zinc-800 mt-6 my-18" />
                <section>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card */}

                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onClick={() => handleClick(feature)}
                                onMouseEnter={() => setHovered(index)}
                                onMouseLeave={() => setHovered(null)}
                                className="relative cursor-pointer bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:bg-zinc-800 transition duration-300"
                            >
                                {/* Hover Message */}
                                {!feature.available && hovered === index && (
                                    <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-md animate-fadeIn">
                                        This feature is coming soon
                                    </div>
                                )}

                                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-600/20 text-2xl mb-6">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400">
                                    {feature.des}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {/* <BackgroundBeams className="opacity-30 scale-90" /> */}

            <hr className="border-t border-zinc-800 mt-6 my-18" />
            <div className="justify-center items-center flex flex-col text-center">
                <h3 className="font-semibold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Who It&apos;s For</h3>
                <h1 className="text-[2.8rem] font-bold mb-4">Built for Every Role</h1>
                <div className="text-2xl font-semibold mb-24">
                    Each user type gets a tailored experience with the right data and the right tools.
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Administrator */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative hover:-translate-y-2 transition duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl" />

                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="text-xl font-semibold mb-1">Administrator</h3>
                        <p className="text-slate-400 mb-6">Full system access</p>

                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Approve admissions
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Post announcements
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Upload exam results
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Manage all users
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> View all reports
                            </li>
                        </ul>
                    </div>

                    {/* Teacher */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative hover:-translate-y-2 transition duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl" />

                        <div className="text-4xl mb-4">👩‍🏫</div>
                        <h3 className="text-xl font-semibold mb-1">Teacher</h3>
                        <p className="text-slate-400 mb-6">Class management</p>

                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Mark attendance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Assign homework
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Upload exam scores
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Post announcements
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> View submissions
                            </li>
                        </ul>
                    </div>

                    {/* Student */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative hover:-translate-y-2 transition duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />

                        <div className="text-4xl mb-4">🎒</div>
                        <h3 className="text-xl font-semibold mb-1">Student</h3>
                        <p className="text-slate-400 mb-6">Personal dashboard</p>

                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> QR attendance check-in
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> View & submit homework
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Check exam results
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Pay fees online
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Track bus in real-time
                            </li>
                        </ul>
                    </div>

                    {/* Parent */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative hover:-translate-y-2 transition duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl" />

                        <div className="text-4xl mb-4">👨‍👩‍👧</div>
                        <h3 className="text-xl font-semibold mb-1">Parent</h3>
                        <p className="text-slate-400 mb-6">Child monitoring</p>

                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Apply for admissions
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Track child's attendance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Monitor exam scores
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Pay school fees
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Follow bus location
                            </li>
                        </ul>
                    </div>

                </div>

            </div>

            <hr className="border-t border-zinc-800 mt-6 my-18" />
            <h1 className="flex flex-col justify-center items-center text-3xl bg-linear-to-r from-blue-500 to-purple-800 bg-clip-text text-transparent pb-8">Built for Schools. Trusted by Educators.</h1>
            <div className="p-10 flex flex-col md:flex-row  justify-between text-zinc-500 gap-10">
                {/* Left Column */}
                <div className="flex flex-col  md:flex-row gap-16">
                    <div>
                        <h2 className="font-bold mb-2 hover:text-zinc-600 cursor-pointer">Help</h2>
                        <ul className="list-none space-y-1">
                            <li className="hover:text-zinc-600 cursor-pointer">FAQ</li>
                            <li className="hover:text-zinc-600 cursor-pointer">Return Policy</li>
                            <li className="hover:text-zinc-600 cursor-pointer">Make A Return</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2 hover:text-zinc-600 cursor-pointer">My Account</h2>
                        <ul className="list-none space-y-1">
                            <li className="hover:text-zinc-600 cursor-pointer">Login</li>
                            <li className="hover:text-zinc-600 cursor-pointer">Register</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2 hover:text-zinc-600 cursor-pointer">Pages</h2>
                        <ul className="list-none space-y-1">
                            <li className="hover:text-zinc-600 cursor-pointer">Stores</li>
                            <li className="hover:text-zinc-600 cursor-pointer">Training App</li>
                            <li className="hover:text-zinc-600 cursor-pointer">Military Discount</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col pl-[24rem]">
                    <h2 className="font-bold mb-4">More About Yoola</h2>
                    <p className="">Our platform is designed specifically for schools to simplify everyday academic and administrative operations. From attendance tracking to homework management and fee monitoring, we provide a unified system that helps teachers, administrators, and parents stay connected and informed.
                        We focus on reliability, security, and ease of use so that schools can manage their daily workflows without depending on manual registers or disconnected tools.</p>
                </div>
            </div>
            <hr className="border-t border-gray-300 mt-2 mb-8" />
            <div className="flex justify-around gap-4">
                <div>© 2026 | Yoola Limited | All Rights Reserved. | One Platform. Total School Control.</div>
                <div className="gap-4 flex">
                    <div>Terms & Conditions</div>
                    <div>Terms of Use</div>
                    <div>Privacy Notice</div>
                    <div>Cookie Policy</div>
                </div>
            </div>

        </div>
    );
};

export default Hero2;
