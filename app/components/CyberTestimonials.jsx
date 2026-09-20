'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CyberTestimonials() {
    const sectionRef = useRef(null);
    const iconRefs = useRef([]);

    const testimonials = [
        {
            quote: "Kalim’s implementation of GSAP motion architecture transformed our web application into an absolute masterpiece. The 60FPS performance is unmatched.",
            author: "Alex Rivera",
            role: "Lead Architect, Veloce Systems",
            metric: "99.9% RENDER FPS",
            nodeId: "NODE // 01",
            svgIcon: (
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            quote: "The custom arcade and interactive physics modules blew our users away. Product Hunt featured us #1 largely due to the breathtaking UI/UX engineering.",
            author: "Sarah Chen",
            role: "Founder, Digi Carotene Academy",
            metric: "#1 PRODUCT OF THE DAY",
            nodeId: "NODE // 02",
            svgIcon: (
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        },
        {
            quote: "Clean Next.js architecture combined with cutting-edge canvas shaders. Kalim delivers elite-tier web experiences that set a new industry standard.",
            author: "Marcus Vance",
            role: "CTO, ExecSync Global",
            metric: "SUB-20MB HEAP",
            nodeId: "NODE // 03",
            svgIcon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=1200',
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            });

            // Initial state: Icons start accumulated/stacked tightly in the center above cards
            iconRefs.current.forEach((el) => {
                if (el) {
                    gsap.set(el, { x: 0, y: 140, scale: 1.2 });
                }
            });

            const isMobile = window.innerWidth < 768;
            const xOffset = isMobile ? 0 : 360;
            const yOffset = isMobile ? -280 : -160;

            // Scroll choreography: Fan out icons into their respective card headers
            if (iconRefs.current[0]) tl.to(iconRefs.current[0], { x: -xOffset, y: yOffset, scale: 1, duration: 1 }, 0);
            if (iconRefs.current[2]) tl.to(iconRefs.current[2], { x: xOffset, y: yOffset, scale: 1, duration: 1 }, 0);
            if (iconRefs.current[1]) tl.to(iconRefs.current[1], { y: yOffset, scale: 1, duration: 1 }, 0);

            // Materialize cards as icons fan out
            tl.from('.testi-card-item', {
                opacity: 0,
                y: 50,
                stagger: 0.1,
                duration: 0.8,
            }, 0.2);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen bg-[#030305] flex flex-col items-center justify-center overflow-hidden border-t border-zinc-900 px-6">

            {/* Section Header */}
            <div className="absolute top-16 text-center z-20">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Section 06 // Radar Telemetry</span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">Encrypted Transmissions</h2>
            </div>

            {/* Main Stage Container */}
            <div className="relative w-full max-w-6xl h-[480px] flex items-center justify-center mt-24">

                {/* Floating Icons Layer (Accumulated at start, fans out on scroll) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            ref={(el) => (iconRefs.current[index] = el)}
                            className="absolute w-14 h-14 rounded-2xl bg-zinc-900 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center backdrop-blur-xl"
                        >
                            {t.svgIcon}
                        </div>
                    ))}
                </div>

                {/* Testimonial Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full z-10 pt-16">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            className="testi-card-item relative rounded-3xl p-8 bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between shadow-2xl"
                            style={{ minHeight: '360px' }}
                        >
                            <div className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono text-emerald-400">{t.nodeId}</span>
                                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        {t.metric}
                                    </span>
                                </div>
                                <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-normal">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="border-t border-zinc-800/80 pt-4 mt-6 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-base">{t.author}</h4>
                                    <span className="text-xs font-mono text-zinc-400">{t.role}</span>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981]" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}